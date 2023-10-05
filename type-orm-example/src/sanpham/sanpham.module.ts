import { Module, forwardRef } from '@nestjs/common';
import { SanPhamService } from './sanpham.service';
import { SanPhamController } from './sanpham.controller';
import { SanPhamRepository } from './sanpham.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SanPham } from './sanpham.entity';
import { AuthorModule } from '../author/author.module';
import { DanhGiaModule } from '../danhgia/danhgia.module';

@Module({
  providers: [SanPhamService, SanPhamRepository],
  imports: [
    TypeOrmModule.forFeature([SanPham]),
    AuthorModule,
    forwardRef(() => DanhGiaModule)
  ],
  controllers: [SanPhamController],
  exports: [SanPhamService, SanPhamRepository]
})
export class SanPhamModule {}
