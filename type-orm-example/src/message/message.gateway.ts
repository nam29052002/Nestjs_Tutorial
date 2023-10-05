import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3005, { cors: true, path: '/message-socket-io' })
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(client: Socket): any {}

  async handleConnection(client: Socket) {
    console.log(client.id);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('client disconnect');
  }

  @SubscribeMessage('clientSendMessage')
  async serverResponse(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message,
  ) {
    console.log(message);
    socket.emit('serverResponse', 'Hello Client');
  }
}
