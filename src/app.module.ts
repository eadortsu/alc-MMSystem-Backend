import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UserDetailsModule } from './user-details/user-details.module';
import { ProgrammesModule } from './programmes/programmes.module';
import { TasksModule } from './tasks/tasks.module';
import { JobRolesModule } from './job-roles/job-roles.module';
import { TechStacksModule } from './tech-stacks/tech-stacks.module';
import { ReportsModule } from './reports/reports.module';
import { CertificatesModule } from './certificates/certificates.module';
import { PostsModule } from './Posts/Posts.module';
import { CommentModule } from './Comments/Comments.module';
import * as dotenv from 'dotenv';
import { MessagesModule } from './Chat/messages/messages.module';
import { InboxModule } from './Chat/inbox/inbox.module';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: false,
      logging: false,
      entities: ['dist/**/*entity.js'],
      migrations: ['dist/migration/*.js'],
    }),
    UsersModule,
    AuthModule,
    UserDetailsModule,
    ProgrammesModule,
    TasksModule,
    JobRolesModule,
    TechStacksModule,
    ReportsModule,
    CertificatesModule,
    CommentModule,
    PostsModule,
    MessagesModule,
    InboxModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
