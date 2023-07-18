import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, Length } from "class-validator";
import { BaseDTO } from "src/base/base.dto";

export class UserDTO extends BaseDTO {
    @IsNotEmpty()
    @Expose() // export attribute
    id: number;

    @IsNotEmpty()
    @Length(1, 20)
    @Expose() // export attribute
    name: string;

    @IsNotEmpty()
    @Length(1, 30)
    @Expose()
    username: string;

    @IsNotEmpty()
    @Length(1, 30)
    password: string;

    firstName: string;
    lastName: string;

    @Transform(({obj}) => obj.firstName + ' ' + obj.lastName)
    @Expose()
    fullName: string;
}
