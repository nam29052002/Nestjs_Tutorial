import { Expose } from "class-transformer";
import { IsNotEmpty, Length } from "class-validator";
import { BaseDTO } from "src/base/base.dto";

export class PostDTO extends BaseDTO {
    @Expose()
    @IsNotEmpty()
    @Length(1, 30)
    title: string;
    
    @Expose()
    @IsNotEmpty()
    @Length(1, 255)
    content: string;
}