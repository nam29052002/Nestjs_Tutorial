import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DanhGia } from "./danhgia.entity";
import { DanhGiaController } from "./danhgia.controller";
import { DanhGiaService } from "./danhgia.service";
import { DanhGiaRepository } from "./danhgia.repository";
import { UserModule } from "../user/user.module";
import { SanPhamModule } from "../sanpham/sanpham.module";
import { JwtBacklistModule } from "../authen/blacklist/jwt.backlist.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([DanhGia]),
    forwardRef(() => UserModule),
    forwardRef(() => SanPhamModule),
    JwtBacklistModule
  ],
  controllers: [DanhGiaController],
  providers: [DanhGiaService, DanhGiaRepository],
  exports: [DanhGiaRepository]
})
export class DanhGiaModule {

}