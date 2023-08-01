import { IsNotEmpty, Length, Max, Min } from "class-validator";

export class SanPhamDTO {
    id: number;

    @IsNotEmpty()
    @Length(1, 30)
    tenSanPham: string;

    soSaoVoteTrungBinh: number;

    soLuongBan: number;

    @IsNotEmpty()
    @Max(2000000)
    @Min(20000)
    giaSanPham: number;

    @IsNotEmpty()
    @Length(5, 15)
    donVi: string;

    @IsNotEmpty()
    anh: string;
}

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