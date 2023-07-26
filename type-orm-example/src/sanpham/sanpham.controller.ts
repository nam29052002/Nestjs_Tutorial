import { Controller, Get, Param, ParseIntPipe, Query, UseFilters } from "@nestjs/common";
import { SanPhamDTO } from "./sanpham.dto";
import { SanPhamChiTietDTO } from "./sanpham.chi-tiet.dto";
import { IsNotEmpty } from "class-validator";
import { SanPhamService } from "./sanpham.service";
import { SanPhamHandlerException } from "./sanpham.filter";

@Controller('api/san-pham')
export class SanPhamController {

    constructor(private readonly sanPhamSerVice: SanPhamService) {}

    @Get('san-pham-ban-chay-nhat')
    sanPhamBanChayNhat(): Promise<SanPhamDTO[]> {
        return this.sanPhamSerVice.getSanPhamBanChayNhat();
    }
    
    @Get('san-pham-duoc-yeu-thich-nhat')
    sanPhamDuocYeuThichNhat(): Promise<SanPhamDTO[]> {
        return this.sanPhamSerVice.getSanPhamDuocYeuThichNhat();
    }

    @UseFilters(SanPhamHandlerException)
    @Get(':id')
    chiTietSanPham(@Param('id', ParseIntPipe) id: number): Promise<SanPhamChiTietDTO> {
        return this.sanPhamSerVice.getChiTietSanPhamById(id);
    }

    // @Get('tim-kiem')
    // timKiemSanPham(@Query('ten') tenSanPham: string): Promise<SanPhamDTO[]> {
    //     return this.sanPhamSerVice.timKiemSanPhamByTen(ten);
    // }
}