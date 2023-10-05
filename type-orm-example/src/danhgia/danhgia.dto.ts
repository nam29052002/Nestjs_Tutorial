import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class DanhGiaRequestDTO {
  @IsNotEmpty()
  @IsString()
  noiDungBinhLuan: string;
  
  @Transform(({ obj }) => obj.soSaoVote = parseInt(obj.soSaoVote))
  @IsNotEmpty()
  @IsInt()
  soSaoVote: number;
}

export class DanhGiaResponseDTO {
  tenUser: string;
  anhUser: string;
  noiDungBinhLuan: string;
  ngayBinhLuan: string;
  soSaoVote: number;
}
