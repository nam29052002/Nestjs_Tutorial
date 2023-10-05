import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SanPhamModule } from './sanpham/sanpham.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfigAsync } from './database-connect/database-connect.config';
import { AuthenModule } from './authen/authen.module';
import { MessageModule } from './message/message.module';
import { MessageGateway } from './message/message.gateway';
import { UploadFilesModule } from './upload-files/upload-files.module';
import { DanhGiaModule } from './danhgia/danhgia.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    UtilsModule,
    SanPhamModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile: false,
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync(typeormConfigAsync),
    AuthenModule,
    // MessageModule,
    UploadFilesModule,
    DanhGiaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
