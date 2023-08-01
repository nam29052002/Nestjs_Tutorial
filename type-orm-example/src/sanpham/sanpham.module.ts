import { Module } from "@nestjs/common";
import { SanPhamService } from "./sanpham.service";
import { SanPhamController } from "./sanpham.controller";
import { SanPhamRepository } from "./sanpham.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SanPham } from "./sanpham.entity";

@Module({
    providers: [SanPhamService, SanPhamRepository],
    imports: [
        TypeOrmModule.forFeature([SanPham])
    ],
    controllers: [SanPhamController]
})
export class SanPhamModule {}