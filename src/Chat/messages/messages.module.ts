import { Module } from '@nestjs/common';
import { MessageService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { messageEntity } from './entities/messageEntity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { audit } from 'rxjs';

@Module({
  imports: [TypeOrmModule.forFeature([messageEntity])],
  controllers:[MessagesGateway],
  providers: [MessageService],
})
export class MessagesModule {}
