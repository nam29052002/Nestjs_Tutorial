import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { DanhGiaService } from "./danhgia.service";
import { DanhGiaRequestDTO, DanhGiaResponseDTO } from "./danhgia.dto";
import { AuthGuard } from "@nestjs/passport";
import { JwtBlaclistGuard } from "../authen/blacklist/jwt.blacklist.guard";
import { AuthorAdminGuard } from "../author/author.guard";
import { Request } from 'express';

@Controller('api/danh-gia')
export class DanhGiaController {
  constructor(private readonly danhGiaService: DanhGiaService) { }

  @Get('by-san-pham')
  danhGiaBySanPham(
    @Query('spid', ParseIntPipe) idSanPham: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('iip', ParseIntPipe) itemInPage: number
  ): Promise<DanhGiaResponseDTO[]> {
    return this.danhGiaService.getDanhGiaByIdSanPham(idSanPham, itemInPage, page);
  }

  @UseGuards(AuthGuard('jwt'), JwtBlaclistGuard, AuthorAdminGuard)
  @Get('by-user')
  danhGiaByUser(
    @Query('uid', ParseIntPipe) idUser: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('iip', ParseIntPipe) itemInPage: number
  ): Promise<DanhGiaResponseDTO[]> {
    return this.danhGiaService.getDanhGiaByIdUser(idUser, itemInPage, page);
  }

  @Get('by-date')
  danhGiaByDate(
    @Query('spid', ParseIntPipe) idSanPham: number,
    @Query('date') date: string,
    @Query('page') page: number,
    @Query('iip') itemInpage: number
  ): Promise<DanhGiaResponseDTO[]> {
    return this.danhGiaService.getDanhGiaByDate(idSanPham, date, page, itemInpage);
  }

  @UseGuards(AuthGuard('jwt'), JwtBlaclistGuard)
  @UsePipes(new ValidationPipe())
  @Post(':spid')
  taoDanhGia(
    @Param('spid', ParseIntPipe) idSanPham: number,
    @Body() danhGiaRequestDTO: DanhGiaRequestDTO,
    @Req() request: Request
  ): Promise<{ statusCode: number, message: string }> {
    return this.danhGiaService.createDanhGia(request, idSanPham, danhGiaRequestDTO);
  }

  @UseGuards(AuthGuard('jwt'), JwtBlaclistGuard)
  @UsePipes(new ValidationPipe())
  @Put(':dgid')
  capnhatDanhGia(
    @Param('dgid', ParseIntPipe) idDanhGia: number,
    @Body() danhGiaRequestDTO: DanhGiaRequestDTO,
    @Req() request: Request
  ): Promise<{ statusCode: number, message: string }> {
    return this.danhGiaService.updateDanhGia(request, idDanhGia, danhGiaRequestDTO);
  }

  @UseGuards(AuthGuard('jwt'), JwtBlaclistGuard)
  @Delete(':dgid')
  xoaDanhGia(
    @Param('dgid', ParseIntPipe) idDanhGia: number,
    @Req() request: Request
  ): Promise<{ statusCode: number, message: string }> {
    return this.danhGiaService.xoaDanhGia(request, idDanhGia);
  }
}
