import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SanPham } from './sanpham.entity';
import { Repository } from 'typeorm';
import { SanPhamChiTietDTO } from './sanpham.dto';

@Injectable()
export class SanPhamRepository {
  constructor(
    @InjectRepository(SanPham) private readonly repo: Repository<SanPham>,
  ) {}

  public getRepo(): Repository<SanPham> {
    return this.repo;
  }

  async getUserById(id: number): Promise<SanPham[]> {
    const sanPham: any[] = await this.repo.query(
      'select * from sanpham where id = $1',
      [id],
    );
    if (sanPham.length == 0) {
      return [];
    }
    const resultSet: SanPham[] = await this.repo.query(
      'select a1.*, a2.so_sao_vote\r\n' +
        'from \r\n' +
        '(\r\n' +
        '	select sp.*, sum(dh.so_luong) as so_luong_ban\r\n' +
        '	from donhang dh, sanpham sp, danhsachdonhang dsdh\r\n' +
        '	where dh.id_sp = sp.id and dh.id_dsdh = dsdh.id and dsdh.ngay_nhan is not null\r\n' +
        '	group by sp.id\r\n' +
        ') as a1\r\n' +
        'left join\r\n' +
        '(\r\n' +
        '	select dg.id_sp, round(cast(sum(dg.so_sao_vote) as numeric) / count(*), 1) as so_sao_vote\r\n' +
        '	from danhgia dg\r\n' +
        '	group by dg.id_sp\r\n' +
        ') as a2\r\n' +
        'on a1.id = a2.id_sp\r\n' +
        'where a1.id = $1;\r\n',
      [id],
    );
    if (resultSet.length == 0) {
      sanPham[0].so_luong_ban = 0;
      sanPham[0].so_sao_vote = 0;
      return [SanPham.itemToSanPhamEnity(sanPham[0])];
    }
    return resultSet.map((item) => {
      const sanPham: SanPham = SanPham.itemToSanPhamEnity(item);
      return sanPham;
    });
  }

  async getSanPhamBanChayNhat(): Promise<SanPham[]> {
    const resultSet: any[] = await this.repo.query(
      'select a1.*, a2.so_sao_vote\r\n' +
        'from \r\n' +
        '(\r\n' +
        '	select sp.*, sum(dh.so_luong) as so_luong_ban\r\n' +
        '	from donhang dh, sanpham sp, danhsachdonhang dsdh\r\n' +
        '	where dh.id_sp = sp.id and dh.id_dsdh = dsdh.id and dsdh.ngay_nhan is not null\r\n' +
        '	group by sp.id\r\n' +
        ') as a1\r\n' +
        'left join\r\n' +
        '(\r\n' +
        '	select dg.id_sp, round(cast(sum(dg.so_sao_vote) as numeric) / count(*), 1) as so_sao_vote\r\n' +
        '	from danhgia dg\r\n' +
        '	group by dg.id_sp\r\n' +
        ') as a2\r\n' +
        'on a1.id = a2.id_sp\r\n' +
        'order by so_luong_ban desc, so_sao_vote desc\r\n' +
        'limit 8;',
    );
    return resultSet.map((item) => {
      const sanPham: SanPham = SanPham.itemToSanPhamEnity(item);
      return sanPham;
    });
  }

  async getSanPhamDuocYeuThichNhat(): Promise<SanPham[]> {
    const resultSet: any[] = await this.repo.query(
      'select a1.*, a2.so_sao_vote\r\n' +
        'from \r\n' +
        '(\r\n' +
        '	select sp.*, sum(dh.so_luong) as so_luong_ban\r\n' +
        '	from donhang dh, sanpham sp, danhsachdonhang dsdh\r\n' +
        '	where dh.id_sp = sp.id and dh.id_dsdh = dsdh.id and dsdh.ngay_nhan is not null\r\n' +
        '	group by sp.id\r\n' +
        ') as a1\r\n' +
        'left join\r\n' +
        '(\r\n' +
        '	select dg.id_sp, round(cast(sum(dg.so_sao_vote) as numeric) / count(*), 1) as so_sao_vote\r\n' +
        '	from danhgia dg\r\n' +
        '	group by dg.id_sp\r\n' +
        ') as a2\r\n' +
        'on a1.id = a2.id_sp\r\n' +
        'order by so_sao_vote desc\r\n' +
        'limit 4;',
    );
    return resultSet.map((item) => {
      const sanPham: SanPham = SanPham.itemToSanPhamEnity(item);
      return sanPham;
    });
  }

  async timKiemSanPhamByTen(tenSanPham: string, page: number): Promise<any[]> {
    const resultSet: any[] = await this.repo.query(
      'select a1.*, a2.so_sao_vote\r\n' +
        'from \r\n' +
        '(\r\n' +
        '	select sp.*, sum(dh.so_luong) as so_luong_ban\r\n' +
        '	from donhang dh, sanpham sp, danhsachdonhang dsdh\r\n' +
        "	where dh.id_sp = sp.id and dh.id_dsdh = dsdh.id and dsdh.ngay_nhan is not null and to_tsvector('english', lower(unaccent(sp.ten))) @@ to_tsquery('english', lower(unaccent($1)))\r\n" +
        '	group by sp.id\r\n' +
        ') as a1\r\n' +
        'left join\r\n' +
        '(\r\n' +
        '	select dg.id_sp, round(cast(sum(dg.so_sao_vote) as numeric) / count(*), 1) as so_sao_vote\r\n' +
        '	from danhgia dg\r\n' +
        '	group by dg.id_sp\r\n' +
        ') as a2\r\n' +
        'on a1.id = a2.id_sp\r\n' +
        'order by so_luong_ban desc, so_sao_vote desc\r\n' +
        'limit 12 offset $2;',
      [tenSanPham, (page - 1) * 12],
    );
    return resultSet.map((item) => {
      const sanPham: SanPham = SanPham.itemToSanPhamEnity(item);
      return sanPham;
    });
  }

  async createSanPham(sanPham: SanPham): Promise<void> {
    const resultSet: any[] = await this.repo.query(
      'insert into sanpham(ten, don_vi, tien_tren_don_vi, nguon_goc, so_luong_nhap, so_luong_tren_don_vi, tom_tat, vi, dinh_duong, bao_quan, anh, phan_loai)\r\n' +
        'values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);',
      [
        sanPham.tenSanPham,
        sanPham.donVi,
        parseInt(sanPham.giaSanPham.toString()),
        sanPham.nguonGoc,
        parseInt(sanPham.soLuongNhap.toString()),
        sanPham.soLuongTrenDonVi,
        sanPham.tomTat,
        sanPham.vi,
        sanPham.dinhDuong,
        sanPham.baoQuan,
        sanPham.anh,
        sanPham.phanLoai,
      ],
    );
  }

  async updateSanPhamById(id: number, sanPham: SanPham): Promise<void> {
    await this.repo.query(
      'update sanpham\r\n' +
        'set ten = $1, don_vi = $2, tien_tren_don_vi = $3, nguon_goc = $4,\r\n' +
        'so_luong_nhap = $5, so_luong_tren_don_vi = $6, tom_tat = $7, vi = $8, dinh_duong = $9,\r\n' +
        'bao_quan = $10, anh = $11, phan_loai = $12\r\n' +
        'where id = $13;',
      [
        sanPham.tenSanPham,
        sanPham.donVi,
        parseInt(sanPham.giaSanPham.toString()),
        sanPham.nguonGoc,
        parseInt(sanPham.soLuongNhap.toString()),
        sanPham.soLuongTrenDonVi,
        sanPham.tomTat,
        sanPham.vi,
        sanPham.dinhDuong,
        sanPham.baoQuan,
        sanPham.anh,
        sanPham.phanLoai,
        id,
      ],
    );
  }

  async deleteSanPhamById(id: number): Promise<void> {
    this.repo.query('delete from sanpham where id = $1', [id]);
  }
}
