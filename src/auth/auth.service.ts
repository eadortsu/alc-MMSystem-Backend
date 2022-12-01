import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInCredentialsDto } from './dto/signin-credentials.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { User, UserRoles } from '../users/entities/user.entity';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { MailService } from 'src/common/mail/mail.service';
import { UpdatePasswordDto } from 'src/users/dto/update-password';
import { ConfigService } from '@nestjs/config';
import { ITokenPayload } from './interface/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private mailService: MailService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    signInCredentialsDto: SignInCredentialsDto,
  ): Promise<{ accessToken: string; user: User }> {
    const { email, password } = signInCredentialsDto;

    let resp = await this.userService.findOne({ email });
    if (!resp) {
      resp = await this.userService.findOne({ username: email });
    }

    if (!resp) {
      resp = await this.userService.findOne({ phone: email });
    }

    if (!resp) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (await resp.validatePassword(password)) {
      const accessToken = this.generateJWT(resp);

      // remove PII
      delete resp.password;
      delete resp.salt;
      delete resp.reset_code;

      return {
        accessToken,
        user: resp,
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(
    signupCredentialsDto: SignupCredentialsDto,
    hostname: string,
  ): Promise<{ accessToken: string; user: User }> {
    if (signupCredentialsDto.role === UserRoles.Admin) {
      if (!signupCredentialsDto.email.endsWith('@andela.com')) {
        throw new UnauthorizedException('Admin must have an @andela.com email');
      }
    }

    const resp = await this.userService.create(signupCredentialsDto);
    const accessToken = this.generateJWT(resp);

    const verificationLink = `https://${hostname}?email=${resp.email}&token=${resp.reset_code}`;
    await this.mailService.send({
      to: resp.email,
      subject: 'Welcome! ALC Mentor...',
      html: `
          <h5>Hi ${resp.name}!</h5>
          <p>We are glad that you've decided to join this awesome community and have taken the first step forward.</p>
          <p>Kindly follow the link below to verify your e-mail address:</p>
          <p><a href="${verificationLink}" target="_blank">${verificationLink}</a></p>
          <p>OR</>
          <p>Copy and Paste the text below to your browser's address bar and press Enter</p>
          <p>${verificationLink}</p>
          <p></p>
          <p>Regards,</p>
          <p>Community Lead</p>
      `,
    });

    // remove PII
    delete resp.password;
    delete resp.salt;
    delete resp.reset_code;

    return {
      accessToken,
      user: resp,
    };
  }

  async verifyEmail(email: string, verificationToken: string) {
    if (!email?.trim()) {
      throw new BadRequestException('E-mail is required');
    }

    if (!verificationToken?.trim()) {
      throw new BadRequestException('Verification token is required');
    }

    const user0 = await this.userService.findOne({ email });
    if (!user0) {
      throw new NotFoundException('No record found');
    }

    if (user0.reset_code !== verificationToken) {
      throw new BadRequestException('Verification token is invalid');
    }

    if (user0.email_verified) {
      throw new UnprocessableEntityException('E-mail is already verified');
    }

    user0.email_verified = true;
    const user = await this.userService.createOrUpdate(user0);
    const accessToken = this.generateJWT(user);

    return {
      status: true,
      data: {
        ...user,
        accessToken,
      },
      message: 'E-mail verification was successful',
    };
  }

  async getUser(id: number): Promise<User> {
    return this.userService.findOne({ id: id });
  }

  //Password recovery
  async forgotPassword(forgotPasswordDto: UpdatePasswordDto): Promise<User> {
    const resp = await this.userService.findOne({
      email: forgotPasswordDto.email,
    });

    if (!resp) {
      throw new BadRequestException('Invalid email');
    }

    const password = crypto.randomUUID();
    resp.reset_code = bcrypt.hashSync(password, 8);

    await this.mailService.send({
      to: resp.email,
      subject: 'Forgot Password',
      html: `
          <h3>Hello ${resp.email}!</h3>
          <p>Please use this reset-code <strong>${password}</strong> to reset your password.</p>
      `,
    });

    return await this.userService.createOrUpdate(resp);
  }

  async changePassword(changePasswordDto: UpdatePasswordDto): Promise<User> {
    const resp = await this.userService.updatePassword(changePasswordDto);

    await this.mailService.send({
      to: resp.email,
      subject: 'Success',
      html: `
          <p>Your password reset was successful.</p>
      `,
    });

    return resp;
  }

  private generateJWT(user: User) {
    const payload: JwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      username: user.username,
      photo: user.phone,
    };

    return this.jwtService.sign(payload);
  }
  public async getUserFromAuthenticationToken(token: string) {
    const payload: ITokenPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
    if (payload.id) {
      return this.userService.findOne(payload.id);
    }
  }
}
