import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './messages.service';

@WebSocketGateway()
export class MessagesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly mesService: MessageService) {}

  async handleConnection(socket: Socket) {
    await this.mesService.getUserFromSocket(socket);
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const author = await this.mesService.getUserFromSocket(socket);
    const message = await this.mesService.saveMessage(content, author);

    this.server.sockets.emit('receive_message', message);

    return message;
  }

  @SubscribeMessage('request_all_messages')
  async requestAllMessages(@ConnectedSocket() socket: Socket) {
    await this.mesService.getUserFromSocket(socket);
    const messages = await this.mesService.getAllMessages();

    socket.emit('send_all_messages', messages);
  }
}
