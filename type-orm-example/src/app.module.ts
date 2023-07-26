import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SanPhamModule } from './sanpham/sanpham.module';
import { SanPham } from './sanpham/sanpham.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [SanPhamModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12345678',
      database: 'fruitshop',
      entities: [SanPham],
      synchronize: false,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
