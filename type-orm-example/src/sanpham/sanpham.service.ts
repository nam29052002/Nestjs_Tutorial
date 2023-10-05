import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { SanPhamRepository } from './sanpham.repository';
import { SanPhamChiTietDTO, SanPhamDTO, SanPhamTestResponseDTO } from './sanpham.dto';
import { SanPham, sanPhamPropertiesMapper } from './sanpham.entity';
import { DanhGiaRepository } from '../danhgia/danhgia.repository';
import { DanhGia, danhGiaPropertiesMapper } from '../danhgia/danhgia.entity';
import { User, userPropertiesMapper } from '../user/user.entity';
import { DanhGiaResponseDTO } from '../danhgia/danhgia.dto';
import { format } from 'date-fns';

@Injectable()
export class SanPhamService {
  constructor(
    private readonly sanPhamRepsitory: SanPhamRepository,
    @Inject(forwardRef(() => DanhGiaRepository)) private readonly danhGiaRepository: DanhGiaRepository
  ) {}

  async getSanPhamBanChayNhat(): Promise<SanPhamDTO[]> {
    const resultSet: any[] =
      await this.sanPhamRepsitory.getSanPhamBanChayNhat();
    return resultSet.map((item) => {
      return SanPham.mapToSanPhamDTO(item);
    });
  }

  async getSanPhamDuocYeuThichNhat(): Promise<SanPhamDTO[]> {
    const resultSet: any[] =
      await this.sanPhamRepsitory.getSanPhamDuocYeuThichNhat();
    return resultSet.map((item) => {
      return SanPham.mapToSanPhamDTO(item);
    });
  }

  async getChiTietSanPhamById(id: number): Promise<SanPhamChiTietDTO> {
    const listItem: any[] = await this.sanPhamRepsitory.getUserById(id);
    if (listItem.length == 0) {
      throw new HttpException(
        'Id san pham khong ton tai',
        HttpStatus.BAD_REQUEST,
      );
    }
    const sanPham: SanPham = listItem[0];
    return SanPham.mapToSanPhamChiTietDTO(sanPham);
  }

  async timKiemSanPhamByTen(
    tenSanPham: string,
    page: number,
  ): Promise<SanPhamDTO[]> {
    const resultSet: any[] = await this.sanPhamRepsitory.timKiemSanPhamByTen(
      tenSanPham,
      page,
    );
    return resultSet.map((item) => {
      return SanPham.mapToSanPhamDTO(item);
    });
  }

  async createSanPham(
    sanPhamChiTietDTO: SanPhamChiTietDTO,
  ): Promise<{ status: string }> {
    await this.sanPhamRepsitory.createSanPham(sanPhamChiTietDTO);
    return { status: 'Tạo sản phẩm mới thành công' };
  }

  async updateSanPhamById(
    id: number,
    sanPhamChiTietDTO: SanPhamChiTietDTO,
  ): Promise<{ status: string }> {
    if ((await this.sanPhamRepsitory.getUserById(id)).length == 0) {
      throw new HttpException(
        'Id sản phẩm không tồn tại !',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.sanPhamRepsitory.updateSanPhamById(id, sanPhamChiTietDTO);
    return { status: 'Cập nhật thành công!' };
  }

  async deleteSanPhamById(id: number): Promise<{ status: string }> {
    if ((await this.sanPhamRepsitory.getUserById(id)).length == 0) {
      throw new HttpException(
        'Id sản phẩm không tồn tại !',
        HttpStatus.BAD_REQUEST,
      );
    }

    await Promise.all([
      this.sanPhamRepsitory.getRepo().delete({ id: id }),
      this.danhGiaRepository.getRepo().delete({ idSanPham: id })
    ]);

    await this.sanPhamRepsitory.deleteSanPhamById(id);
    return { status: 'Xóa sản phẩm thành công!' };
  }

  async getDanhSachSanPhamTest(itemInPage: number, page: number): Promise<SanPhamTestResponseDTO[]> {
    if (itemInPage > 5 || itemInPage < 1) {
      throw new HttpException('Vượt quá số lượng item trong một page', HttpStatus.BAD_REQUEST);
    }

    let allPage: number = await this.sanPhamRepsitory.getRepo().createQueryBuilder('sp')
      .getCount()
    
    allPage = (allPage % itemInPage == 0) ? (allPage / itemInPage) : (allPage / itemInPage) + 1;
    if (page > allPage) {
      throw new HttpException('page vượt quá số trang tối đa', HttpStatus.BAD_REQUEST);
    }

    const subQuery: string = this.danhGiaRepository.getRepo().createQueryBuilder('dg')
      .innerJoinAndSelect('dg.user', 'u')
      .orderBy('dg.ngayBinhLuan', 'DESC')
      .getQuery();

    const resultRaw = await this.sanPhamRepsitory.getRepo().createQueryBuilder('sp')
      .leftJoinAndSelect(`(${subQuery})`, 'subQuery', 'sp.id = "subQuery".dg_id_sp')
      .where('sp.id between :startIndex and :endIndex', {
        startIndex: 1 + (page - 1) * itemInPage,
        endIndex: (page - 1) * itemInPage + itemInPage
      })
      .orderBy({ 'sp.id': 'ASC' })
      .getRawMany();
    
    // console.log(Object.keys(SanPham.prototype));
    const result: SanPham[] = [];
    for (let i = 0; i < resultRaw.length; i++) {

      const sanPham = new SanPham();
      const danhGia = new DanhGia();
      const user = new User();

      for (let key in resultRaw[i]) {
        if (key.startsWith('sp')) {
          sanPham[sanPhamPropertiesMapper[key.substring(3)]] = resultRaw[i][key];
        }
        else if (key.startsWith('dg')) {
          danhGia[danhGiaPropertiesMapper[key.substring(3)]] = resultRaw[i][key];
        }
        else {
          user[userPropertiesMapper[key.substring(2)]] = resultRaw[i][key];
        }
      }
      danhGia.user = user;
      if (i == 0) {
        sanPham.listDanhGia = [];
        sanPham.listDanhGia.push(danhGia);
        result.push(sanPham);
      }
      else if (i > 0 && sanPham.id != result[result.length - 1].id) {
        sanPham.listDanhGia = [];
        sanPham.listDanhGia.push(danhGia);
        result.push(sanPham);
      }
      else result[result.length - 1].listDanhGia.push(danhGia);
      // console.log(sanPham);
    }
    // return null;
    // console.log(result[0].listDanhGia);
    return result.map(sanPham => {
      return {
        id: sanPham.id,
        tenSanPham: sanPham.tenSanPham,
        listDanhGia: sanPham.listDanhGia.map(danhGia => {
          return {
            tenUser: danhGia.user.ten,
            anhUser: danhGia.user.anh,
            noiDungBinhLuan: danhGia.noiDungBinhLuan,
            ngayBinhLuan: format(danhGia.ngayBinhLuan, 'dd/MM/yyyy'),
            soSaoVote: danhGia.soSaoVote
          } as DanhGiaResponseDTO;
        })
      } as SanPhamTestResponseDTO;
    });
  }
}
