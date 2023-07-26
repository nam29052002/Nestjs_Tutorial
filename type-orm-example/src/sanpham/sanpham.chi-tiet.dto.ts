import { IsNotEmpty, Length } from "class-validator";
import { SanPhamDTO } from "./sanpham.dto";

export class SanPhamChiTietDTO extends SanPhamDTO {
    id: number;

    @Length(5, 15)
    @IsNotEmpty()
    nguonGoc: string;

    tinhTrang: string;

    @Length(5, 20)
    @IsNotEmpty()
    soLuongTrenDonVi: string;

    @IsNotEmpty()
    @Length(1, 1000)
    tomTat: string;

    @IsNotEmpty()
    @Length(1, 100)
    vi: string;

    @IsNotEmpty()
    @Length(1, 100)
    dinhDuong: string;

    @IsNotEmpty()
    @Length(1, 1000)
    baoQuan: string;
}