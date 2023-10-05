import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { DanhGiaRepository } from "./danhgia.repository";
import { DanhGiaRequestDTO, DanhGiaResponseDTO } from "./danhgia.dto";
import { SanPhamRepository } from "../sanpham/sanpham.repository";
import { UserRepository } from "../user/user.repository";
import { format, isValid, parse } from "date-fns";
import { Request } from "express";
import { DanhGia } from "./danhgia.entity";

@Injectable()
export class DanhGiaService {
  constructor(
    private readonly danhGiaRepository: DanhGiaRepository,
    private readonly sanPhamRepository: SanPhamRepository,
    private readonly userRepository: UserRepository,
  ) { }

  async getDanhGiaByIdSanPham(idSanPham: number, itemInPage: number, page: number): Promise<DanhGiaResponseDTO[]> {
    if (itemInPage > 5 || itemInPage < 1) {
      throw new HttpException('Vượt quá số lượng item trong một page', HttpStatus.BAD_REQUEST);
    }

    if (!(await this.sanPhamRepository.getRepo().findOneBy({ id: idSanPham }))) {
      throw new HttpException('Sản phẩm không tồn tại', HttpStatus.BAD_REQUEST);
    }

    let allPage = await this.danhGiaRepository.getRepo().createQueryBuilder('danhgia')
      .innerJoinAndSelect('danhgia.sanPham', 'sanPham')
      .innerJoinAndSelect('danhgia.user', 'user')
      .where('danhgia.idSanPham = :idSanPham', { idSanPham: idSanPham })
      .getCount()

    allPage = (allPage % itemInPage == 0) ? (allPage / itemInPage) : (allPage / itemInPage + 1);
    if (page > allPage) {
      throw new HttpException('page vượt quá số trang tối đa', HttpStatus.BAD_REQUEST);
    }

    const result = await this.danhGiaRepository.getRepo().createQueryBuilder('danhgia')
      .innerJoinAndSelect('danhgia.sanPham', 'sanPham')
      .innerJoinAndSelect('danhgia.user', 'user')
      .where('danhgia.idSanPham = :idSanPham', { idSanPham: idSanPham })
      .orderBy('danhgia.soSaoVote', 'DESC')
      .addOrderBy('danhgia.ngayBinhLuan', 'DESC')
      .offset((page - 1) * itemInPage)
      .limit(itemInPage)
      .getMany()

    return result.map(item => {
      return {
        tenUser: item.user.ten,
        anhUser: item.user.anh,
        noiDungBinhLuan: item.noiDungBinhLuan,
        ngayBinhLuan: format(item.ngayBinhLuan, 'dd/MM/yyyy HH:mm:ss'),
        soSaoVote: item.soSaoVote
      } as DanhGiaResponseDTO;
    });
  }

  async getDanhGiaByIdUser(idUser: number, itemInPage: number, page: number): Promise<DanhGiaResponseDTO[]> {
    if (itemInPage > 5 || itemInPage < 1) {
      throw new HttpException('Vượt quá số lượng item trong một page', HttpStatus.BAD_REQUEST);
    }

    if (!(await this.userRepository.getRepo().findOneBy({ id: idUser }))) {
      throw new HttpException('User không tồn tại', HttpStatus.BAD_REQUEST);
    }

    let allPage = await this.danhGiaRepository.getRepo().createQueryBuilder('danhgia')
      .innerJoinAndSelect('danhgia.sanPham', 'sanPham')
      .innerJoinAndSelect('danhgia.user', 'user')
      .where('danhgia.idUser = :idUser', { idUser: idUser })
      .getCount()

    allPage = (allPage % itemInPage == 0) ? (allPage / itemInPage) : (allPage / itemInPage + 1);
    if (page > allPage) {
      throw new HttpException('page vượt quá số trang tối đa', HttpStatus.BAD_REQUEST);
    }

    const result = await this.danhGiaRepository.getRepo().createQueryBuilder('danhgia')
      .innerJoinAndSelect('danhgia.sanPham', 'sanPham')
      .innerJoinAndSelect('danhgia.user', 'user')
      .where('danhgia.idUser = :idUser', { idUser: idUser })
      .orderBy('danhgia.soSaoVote', 'DESC')
      .addOrderBy('danhgia.ngayBinhLuan', 'DESC')
      .offset((page - 1) * itemInPage)
      .limit(itemInPage)
      .getMany()

    return result.map(item => {
      return {
        tenUser: item.user.ten,
        anhUser: item.user.anh,
        noiDungBinhLuan: item.noiDungBinhLuan,
        ngayBinhLuan: format(item.ngayBinhLuan, 'dd/MM/yyyy HH:mm:ss'),
        soSaoVote: item.soSaoVote
      } as DanhGiaResponseDTO;
    });
  }

  async getDanhGiaByDate(idSanPham: number, date: string, page: number, itemInPage: number): Promise<DanhGiaResponseDTO[]> {
    const dateInstance = parse(date, 'dd/MM/yyyy', new Date());
    if (!isValid(dateInstance)) {
      throw new HttpException('formate date phải là dd/MM/yyyy', HttpStatus.BAD_REQUEST);
    }

    if (itemInPage > 5 || itemInPage < 1) {
      throw new HttpException('Vượt quá số lượng item trong một page', HttpStatus.BAD_REQUEST);
    }

    if (!(await this.sanPhamRepository.getRepo().findOneBy({ id: idSanPham }))) {
      throw new HttpException('Sản phẩm không tồn tại', HttpStatus.BAD_REQUEST);
    }

    let allPage = await this.danhGiaRepository.getRepo().createQueryBuilder('danhgia')
      .innerJoinAndSelect('danhgia.sanPham', 'sanPham')
      .innerJoinAndSelect('danhgia.user', 'user')
      .where('danhgia.idSanPham = :idSanPham', { idSanPham: idSanPham })
      .andWhere('DATE(danhgia.ngayBinhLuan) = :dateString', { dateString: format(dateInstance, 'yyyy-MM-dd') })
      .getCount();

    allPage = (allPage % itemInPage == 0) ? (allPage / itemInPage) : (allPage / itemInPage + 1);
    if (page > allPage) {
      throw new HttpException('page vượt quá số trang tối đa', HttpStatus.BAD_REQUEST);
    }

    const result = await this.danhGiaRepository.getRepo().createQueryBuilder('danhgia')
      .innerJoinAndSelect('danhgia.sanPham', 'sanPham')
      .innerJoinAndSelect('danhgia.user', 'user')
      .where('danhgia.idSanPham = :idSanPham', { idSanPham: idSanPham })
      .andWhere('DATE(danhgia.ngayBinhLuan) = :dateString', { dateString: format(dateInstance, 'yyyy-MM-dd') })
      .offset((page - 1) * itemInPage)
      .limit(itemInPage)
      .getMany()

    return result.map(item => {
      return {
        tenUser: item.user.ten,
        anhUser: item.user.anh,
        noiDungBinhLuan: item.noiDungBinhLuan,
        ngayBinhLuan: format(item.ngayBinhLuan, 'dd/MM/yyyy HH:mm:ss'),
        soSaoVote: item.soSaoVote
      } as DanhGiaResponseDTO;
    });
  }

  async createDanhGia(request: Request, idSanPham: number, danhGiaRequestDTO: DanhGiaRequestDTO): Promise<{ statusCode: number, message: string }> {
    if (!(await this.sanPhamRepository.getRepo().findOneBy({ id: idSanPham }))) {
      throw new HttpException('Sản phẩm không tồn tại!', HttpStatus.BAD_REQUEST);
    }
    
    const idUser = request['user']['sub'];

    const danhGia: DanhGia = this.danhGiaRepository.getRepo().create({
      idUser: idUser,
      idSanPham: idSanPham,
      ngayBinhLuan: new Date(),
      noiDungBinhLuan: danhGiaRequestDTO.noiDungBinhLuan,
      soSaoVote: danhGiaRequestDTO.soSaoVote,
    });

    await this.danhGiaRepository.getRepo().save(danhGia);

    return {
      statusCode: 201,
      message: 'Tạo đánh giá thành công!'
    };
  }

  async updateDanhGia(request: Request, idDanhGia: number, danhGiaRequestDTO: DanhGiaRequestDTO): Promise<{ statusCode: number, message: string }> {
    const danhGia: DanhGia = await this.danhGiaRepository.getRepo().findOneBy({ id: idDanhGia });
    if (!danhGia) {
      throw new HttpException('Đánh giá không tồn tại!', HttpStatus.BAD_REQUEST);
    }

    const idUser = request['user']['sub'];
    if (danhGia.idUser !== idUser) {
      throw new HttpException('Bạn không có quyền sửa đánh giá này!', HttpStatus.UNAUTHORIZED);
    }

    await this.danhGiaRepository.getRepo().update({ id: idDanhGia }, { ...danhGiaRequestDTO });
    return {
      statusCode: 200,
      message: 'Cập nhật đánh giá thành công!'
    };
  }

  async xoaDanhGia(request: Request, idDanhGia: number): Promise<{ statusCode: number, message: string }> {
    const danhGia: DanhGia = await this.danhGiaRepository.getRepo().findOneBy({ id: idDanhGia });
    if (!danhGia) {
      throw new HttpException('Đánh giá không tồn tại!', HttpStatus.BAD_REQUEST);
    }

    const idUser = request['user']['sub'];
    if (danhGia.idUser !== idUser) {
      throw new HttpException('Bạn không có quyền xóa đánh giá này!', HttpStatus.UNAUTHORIZED);
    }

    await this.danhGiaRepository.getRepo().delete({ id: idDanhGia });
    return {
      statusCode: 200,
      message: 'Xóa đánh giá thành công!'
    };
  }
}
