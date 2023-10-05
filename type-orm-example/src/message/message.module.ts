import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import {} from '@nestjs/platform-socket.io';
import { ConfigModule } from '@nestjs/config';
import { MessageSocketIoAdapter } from './message.socketio-adapter';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   envFilePath: '.env',
    //   ignoreEnvFile: false,
    // }),
  ],
  providers: [MessageGateway, MessageSocketIoAdapter],
  exports: [MessageGateway],
})
export class MessageModule {}
