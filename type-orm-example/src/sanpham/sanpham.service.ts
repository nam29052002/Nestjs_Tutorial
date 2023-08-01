import { HttpException, Injectable } from "@nestjs/common";
import { SanPhamRepository } from "./sanpham.repository";
import { SanPhamChiTietDTO, SanPhamDTO } from "./sanpham.dto";
import { SanPham } from "./sanpham.entity";

@Injectable()
export class SanPhamService {
    constructor(private readonly sanPhamRepsitory: SanPhamRepository) {}

    async getSanPhamBanChayNhat(): Promise<SanPhamDTO[]> {
        const resultSet = await this.sanPhamRepsitory.getSanPhamBanChayNhat();
        return resultSet.map(item => {
            return SanPham.mapToSanPhamDTO(item);
        });
    }

    async getSanPhamDuocYeuThichNhat(): Promise<SanPhamDTO[]> {
        const resultSet = await this.sanPhamRepsitory.getSanPhamDuocYeuThichNhat();
        return resultSet.map(item => {
            return SanPham.mapToSanPhamDTO(item);
        });
    }

    async getChiTietSanPhamById(id: number): Promise<SanPhamChiTietDTO> {
        const listItem = await this.sanPhamRepsitory.getUserById(id);
        if (listItem.length == 0) {
            throw new HttpException('Id san pham khong ton tai', 500);
        }
        const sanPham: SanPham = listItem[0];
        return SanPham.mapToSanPhamChiTietDTO(sanPham);
    }

    async timKiemSanPhamByTen(tenSanPham: string, page: number): Promise<SanPhamDTO[]> {
        const resultSet = await this.sanPhamRepsitory.timKiemSanPhamByTen(tenSanPham, page);
        return resultSet.map(item => {
            return SanPham.mapToSanPhamDTO(item);
        });
    }
}