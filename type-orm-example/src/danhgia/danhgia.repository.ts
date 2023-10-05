import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DanhGia } from "./danhgia.entity";

@Injectable()
export class DanhGiaRepository {
  constructor(@InjectRepository(DanhGia) private readonly danhGiaRepository: Repository<DanhGia>) {}

  public getRepo(): Repository<DanhGia> {
    return this.danhGiaRepository;
  }
}
