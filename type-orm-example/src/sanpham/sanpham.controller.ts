import { Controller, Get, Param, ParseIntPipe, Query, UseFilters } from "@nestjs/common";
import { SanPhamChiTietDTO, SanPhamDTO } from "./sanpham.dto";
import { IsNotEmpty } from "class-validator";
import { SanPhamService } from "./sanpham.service";
import { SanPhamHandlerException } from "../filter/sanpham.filter";

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

    @UseFilters(new SanPhamHandlerException(('Can not parse number beacasue id is not number type')))
    @Get('tim-kiem')
    timKiemSanPham(@Query('ten') tenSanPham: string, @Query('page', ParseIntPipe) page: number): Promise<SanPhamDTO[]> {
        return this.sanPhamSerVice.timKiemSanPhamByTen(tenSanPham, page);
    }

    @UseFilters(new SanPhamHandlerException(('Can not parse number beacasue id is not number type')))
    @Get(':id')
    chiTietSanPham(@Param('id', ParseIntPipe) id: number): Promise<SanPhamChiTietDTO> {
        return this.sanPhamSerVice.getChiTietSanPhamById(id);
    }
}