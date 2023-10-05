import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SanPhamChiTietDTO, SanPhamDTO, SanPhamTestResponseDTO } from './sanpham.dto';
import { SanPhamService } from './sanpham.service';
import { HandlerException } from '../filter/sanpham.filter';
import { plainToClass } from 'class-transformer';
import { AuthGuard } from '@nestjs/passport';
import { AuthorAdminGuard } from '../author/author.guard';

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

  @UseFilters(
    new HandlerException('Can not parse number beacasue id is not number type'),
  )
  @Post('tim-kiem')
  timKiemSanPham(
    @Query('ten') tenSanPham: string,
    @Query('page', ParseIntPipe) page: number
  ): Promise<SanPhamDTO[]> {
    return this.sanPhamSerVice.timKiemSanPhamByTen(tenSanPham, page);
  }

  @Get('danh-sach-san-pham-test')
  danhSachSanPhamTest(
    @Query('iip', ParseIntPipe) itemInPage: number,
    @Query('page', ParseIntPipe) page: number
  ): Promise<SanPhamTestResponseDTO[]> {
    return this.sanPhamSerVice.getDanhSachSanPhamTest(itemInPage, page);
  }
  
  @Get(':id')
  async chiTietSanPham(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SanPhamChiTietDTO> {
    const sanPhamChiTietDTO: SanPhamChiTietDTO =
      await this.sanPhamSerVice.getChiTietSanPhamById(id);
    return plainToClass(SanPhamChiTietDTO, sanPhamChiTietDTO, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(AuthGuard('jwt'), AuthorAdminGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async creat(
    @Body() sanPhamChiTietDTO: SanPhamChiTietDTO,
  ): Promise<{ status: string }> {
    return await this.sanPhamSerVice.createSanPham(sanPhamChiTietDTO);
  }

  @UseGuards(AuthGuard('jwt'), AuthorAdminGuard)
  @Put('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() sanPhamChiTietDTO: SanPhamChiTietDTO,
  ): Promise<{ status: string }> {
    return await this.sanPhamSerVice.updateSanPhamById(id, sanPhamChiTietDTO);
  }

  @UseGuards(AuthGuard('jwt'), AuthorAdminGuard)
  @Delete('delete/:id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ status: string }> {
    return await this.sanPhamSerVice.deleteSanPhamById(id);
  }
}
