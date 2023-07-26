import { Expose, Transform } from "class-transformer";
import { IsInt, IsNotEmpty, Length, Matches } from "class-validator";

export class UserDTO {
    @IsInt()
    @IsNotEmpty()
    @Expose()
    id: number;

    @IsNotEmpty()
    @Expose()
    @Length(1, 20)
    firstName: string;

    @IsNotEmpty()
    @Expose()
    @Length(1, 20)
    lastName: string;

    @Expose()
    @Transform(({obj}) => obj.firstName + ' ' + obj.lastName)
    fullName: string;

    @IsNotEmpty()
    @Expose()
    @Length(1, 20)
    @Matches(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    email: string;

    @IsNotEmpty()
    @Expose()
    @Length(1, 20)
    username: string;

    @IsNotEmpty()
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
    password: string;

    @IsNotEmpty()
    @Expose()
    @Length(1, 20)
    img: string;
}
