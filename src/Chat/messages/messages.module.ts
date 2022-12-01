import { Module } from '@nestjs/common';
import { MessageService } from './messages.service';
import { MessagesGateway } from './messages.gateway';

@Module({
  providers: [MessagesGateway, MessageService]
})
export class MessagesModule {}
