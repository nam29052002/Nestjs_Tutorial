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