import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { messageEntity } from './entities/messageEntity.entity';

@Injectable()
export class MessageService {
  constructor(
    private readonly authenticationService: AuthService,
    @InjectRepository(messageEntity)
    private messagesRepository: Repository<messageEntity>,
  ) {}

  async saveMessage(content: string, author: User) {
    const newMessage = this.messagesRepository.create({});
    await this.messagesRepository.save(newMessage);
    return newMessage;
  }

  async getAllMessages() {
    return this.messagesRepository.find({
      relations: ['author'],
    });
  }
  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authenticationToken } = parse(cookie);
    const user =
      await this.authenticationService.getUserFromAuthenticationToken(
        authenticationToken,
      );
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  // ...
}
