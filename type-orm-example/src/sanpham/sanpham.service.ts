import { HttpException, Injectable } from "@nestjs/common";
import { SanPhamRepository } from "./sanpham.repository";
import { SanPhamDTO } from "./sanpham.dto";
import { SanPham } from "./sanpham.entity";
import { SanPhamChiTietDTO } from "./sanpham.chi-tiet.dto";

@Injectable()
export class SanPhamService {
    constructor(private readonly sanPhamRepsitory: SanPhamRepository) {}

    async getSanPhamBanChayNhat(): Promise<SanPhamDTO[]> {
        const resultSet = await this.sanPhamRepsitory.getSanPhamBanChayNhat();
        return resultSet.map(item => {
            const sanPham: SanPham = SanPham.toSanPhamEnity(item);
            return SanPham.mapToSanPhamDTO(sanPham);
        });
    }

    async getSanPhamDuocYeuThichNhat(): Promise<SanPhamDTO[]> {
        const resultSet = await this.sanPhamRepsitory.getSanPhamDuocYeuThichNhat();
        return resultSet.map(item => {
            const sanPham: SanPham = SanPham.toSanPhamEnity(item);
            return SanPham.mapToSanPhamDTO(sanPham);
        });
    }

    async getChiTietSanPhamById(id: number): Promise<SanPhamChiTietDTO> {
        const listItem = await this.sanPhamRepsitory.getUserById(id);
        if (listItem.length == 0) {
            throw new HttpException(JSON.stringify({ statusCode: 500, message: 'ID san pham khong ton tai' }), 500);
        }
        const sanPham: SanPham = SanPham.toSanPhamEnity(listItem[0]);
        return SanPham.mapToSanPhamChiTietDTO(sanPham);
    }
}