import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, Length, Max, Min } from 'class-validator';
import { DanhGiaResponseDTO } from 'src/danhgia/danhgia.dto';

export class SanPhamDTO {
  id: number;

  @IsNotEmpty()
  @Length(1, 30)
  @Expose()
  tenSanPham: string;

  @Expose()
  soSaoVoteTrungBinh: number;

  @Expose()
  @IsInt()
  soLuongBan: number;

  @IsNotEmpty()
  @Max(2000000)
  @Min(20000)
  @Expose()
  @IsInt()
  giaSanPham: number;

  @IsNotEmpty()
  @Length(5, 15)
  @Expose()
  donVi: string;

  @IsNotEmpty()
  @Expose()
  anh: string;
}

export class SanPhamChiTietDTO extends SanPhamDTO {
  @Length(5, 15)
  @IsNotEmpty()
  @Expose()
  nguonGoc: string;

  @Expose()
  tinhTrang: string;

  @Length(5, 20)
  @IsNotEmpty()
  @Expose()
  soLuongTrenDonVi: string;

  @Min(0)
  @Max(10000)
  @IsInt()
  soLuongNhap: number;

  @IsNotEmpty()
  @Length(1, 1000)
  @Expose()
  tomTat: string;

  @IsNotEmpty()
  @Length(1, 100)
  @Expose()
  vi: string;

  @IsNotEmpty()
  @Length(1, 100)
  @Expose()
  dinhDuong: string;

  @IsNotEmpty()
  @Length(1, 1000)
  @Expose()
  baoQuan: string;

  @IsNotEmpty()
  @Length(1, 100)
  @Expose()
  phanLoai: string;
}

export class SanPhamTestResponseDTO {
  id: number;
  tenSanPham: string;
  listDanhGia: DanhGiaResponseDTO[];
}
