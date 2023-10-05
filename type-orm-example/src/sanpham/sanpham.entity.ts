import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SanPhamChiTietDTO, SanPhamDTO } from './sanpham.dto';
import { Max, Min } from 'class-validator';
import { DanhGia } from '../danhgia/danhgia.entity';

@Entity({ name: 'sanpham' })
export class SanPham {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'ten', length: 255, nullable: false })
  tenSanPham: string;

  soSaoVoteTrungBinh: number;

  @Column({ name: 'so_luong_nhap', nullable: false })
  @Min(0)
  @Max(10000)
  soLuongNhap: number;

  soLuongBan: number;

  @Column({ name: 'tien_tren_don_vi', nullable: false })
  giaSanPham: number;

  @Column({ name: 'don_vi', length: 255, nullable: false })
  donVi: string;

  @Column({ name: 'nguon_goc', length: 255, nullable: false })
  nguonGoc: string;

  tinhTrang: string;

  @Column({ name: 'so_luong_tren_don_vi', length: 255, nullable: false })
  soLuongTrenDonVi: string;

  @Column({ name: 'tom_tat', length: 2000, nullable: false })
  tomTat: string;

  @Column({ name: 'vi', length: 255, nullable: false })
  vi: string;

  @Column({ name: 'dinh_duong', length: 2000, nullable: false })
  dinhDuong: string;

  @Column({ name: 'bao_quan', length: 1000, nullable: false })
  baoQuan: string;

  @Column({ name: 'anh', length: 255, nullable: false })
  anh: string;

  @Column({ name: 'phan_loai', length: 45, nullable: false })
  phanLoai: string;

  @OneToMany(() => DanhGia, danhGia => danhGia.sanPham)
  listDanhGia?: DanhGia[];

  static mapToSanPhamDTO(sanPham: SanPham): SanPhamDTO {
    const {
      nguonGoc,
      soLuongTrenDonVi,
      tomTat,
      vi,
      dinhDuong,
      baoQuan,
      soLuongNhap,
      tinhTrang,
      phanLoai,
      ...sanPhamDTO
    } = sanPham;
    return sanPhamDTO;
  }

  static mapToSanPhamChiTietDTO(sanPham: SanPham): SanPhamChiTietDTO {
    const { ...sanPhamChiTietDTO } = sanPham;
    return sanPhamChiTietDTO;
  }

  static itemToSanPhamEnity(item: any): SanPham {
    let sanPham: SanPham = {
      id: item.id,
      tenSanPham: item.ten,
      donVi: item.don_vi,
      giaSanPham: item.tien_tren_don_vi,
      nguonGoc: item.nguon_goc,
      soLuongNhap: item.so_luong_nhap,
      soLuongTrenDonVi: item.so_luong_tren_don_vi,
      tomTat: item.tom_tat,
      dinhDuong: item.dinh_duong,
      baoQuan: item.bao_quan,
      anh: item.anh,
      phanLoai: item.phan_loai,
      soLuongBan: parseFloat(item.so_luong_ban),
      soSaoVoteTrungBinh: -1,
      vi: item.vi,
      tinhTrang: 'Còn hàng',
    };
    sanPham.tinhTrang =
      sanPham.soLuongNhap > sanPham.soLuongBan ? 'Còn hàng' : 'Hết hàng';
    if (item.so_sao_vote != null) {
      sanPham = {
        ...sanPham,
        soSaoVoteTrungBinh: parseFloat(item.so_sao_vote),
      };
    }
    return sanPham;
  }
}

export const sanPhamPropertiesMapper = {
  id: 'id',
  ten: 'ten',
  so_luong_nhap: 'soLuongNhap',
  tien_tren_don_vi: 'giaSanPham',
  don_vi: 'donVi',
  nguon_goc: 'nguonGoc',
  so_luong_tren_don_vi: 'soLuongTrenDonVi',
  tom_tat: 'tomTat',
  vi: 'vi',
  dinh_duong: 'dinhDuong',
  bao_quan: 'baoQuan',
  anh: 'anh',
  phan_loai: 'phanLoai'
}
