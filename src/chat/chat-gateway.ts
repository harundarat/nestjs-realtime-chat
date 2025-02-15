import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';

@WebSocketGateway(3001, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleDisconnect(client: Socket) {
    this.server.emit('user-left', {
      message: `User left the chat: ${client.id}`,
    });
  }

  handleConnection(client: Socket) {
    client.broadcast.emit('user-joined', {
      message: `New user joined: ${client.id}`,
    });

    // this.server.emit('user-joined', {
    //   message: `New user joined: ${client.id}`,
    // });
  }

  @SubscribeMessage('newMessage')
  handleMessage(client: Socket, message: any) {
    this.server.emit('chat', { message: `${client.id}: ${message}` });
  }
}
