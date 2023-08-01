import { Expose } from "class-transformer";
import { IsNotEmpty, Length, Matches, Max, Min } from "class-validator";

export class UserDTO {
    @Expose()
    @IsNotEmpty()
    id: number;
    
    @Expose()
    @IsNotEmpty()
    @Length(1, 30)
    ten: string;

    @Expose()
    @IsNotEmpty()
    @Length(1, 20)
    @Matches(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    email: string;

    @IsNotEmpty()
    @Length(8)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
    matKhau: string;

    @Expose()
    anh: string = null;

    @Expose()
    @Length(1, 1)
    vaiTro: string = 'u';

    @Expose()
    @Min(0)
    @Max(1)
    trangThai: number = 0;
}