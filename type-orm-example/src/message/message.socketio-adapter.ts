import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';

export class MessageSocketIoAdapter extends IoAdapter {
  private readonly url: string;

  constructor(app: INestApplicationContext) {
    super(app);
    this.url = '/message-socket-io'; // Đặt URL tùy ý cho WebSocket
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server: Server = super.createIOServer(port, options);

    // Đặt URL cho WebSocket
    server.path(this.url);

    return server;
  }
}
