import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SanPhamModule } from './sanpham/sanpham.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfigAsync } from './database-connect/database-connect.config';
import { AuthModule } from './authen/authen.module';

@Module({
  imports: [
    SanPhamModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile: false
    }),
    TypeOrmModule.forRootAsync(typeormConfigAsync),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
