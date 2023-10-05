import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, Length, Matches } from "class-validator";

export class UserDTO {
    @Expose()
    id: number;

    @Expose()
    @IsNotEmpty()
    @Length(1, 30)
    ten: string;

    @Expose()
    @IsNotEmpty()
    @Length(1, 50)
    @Matches(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    email: string;

    @IsNotEmpty()
    @Length(8)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    matKhau: string;

    @Expose()
    anh: string = null;

    @Transform(({ obj }) => obj.vaiTro = 'u')
    @Expose()
    @Length(1, 1)
    vaiTro: string;

    @Expose()
    trangThai: number = 0;
}