import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SanPham } from "./sanpham.entity";
import { Repository } from "typeorm";

@Injectable()
export class SanPhamRepository {
    constructor(@InjectRepository(SanPham) private readonly repo: Repository<SanPham>) {}

    async getUserById(id: number): Promise<SanPham[]> {
        const resultSet: SanPham[] = await this.repo.query(
            "select * from sanpham where id = $1",
            [id]
        );
        return resultSet.map(item => {
            const sanPham: SanPham = SanPham.toSanPhamEnity(item);
            return sanPham;
        });;
    }

    async getSanPhamBanChayNhat(): Promise<SanPham[]> {
        const resultSet: any[] = await this.repo.query(
            "select a1.*, a2.so_sao_vote\r\n"
            + "from \r\n"
            + "(\r\n"
            + "	select sp.*, sum(dh.so_luong) as so_luong_ban\r\n"
            + "	from donhang dh, sanpham sp, danhsachdonhang dsdh\r\n"
            + "	where dh.id_sp = sp.id and dh.id_dsdh = dsdh.id and dsdh.ngay_nhan is not null\r\n"
            + "	group by sp.id\r\n"
            + ") as a1\r\n"
            + "left join\r\n"
            + "(\r\n"
            + "	select dg.id_sp, round(cast(sum(dg.so_sao_vote) as numeric) / count(*), 1) as so_sao_vote\r\n"
            + "	from danhgia dg\r\n"
            + "	group by dg.id_sp\r\n"
            + ") as a2\r\n"
            + "on a1.id = a2.id_sp\r\n"
            + "order by so_luong_ban desc, so_sao_vote desc\r\n"
            + "limit 8;",
        );
        return resultSet.map(item => {
            const sanPham: SanPham = SanPham.toSanPhamEnity(item);
            return sanPham;
        });
    }

    async getSanPhamDuocYeuThichNhat(): Promise<SanPham[]> {
        const resultSet: any[] = await this.repo.query(
            "select a1.*, a2.so_sao_vote\r\n"
            + "from \r\n"
            + "(\r\n"
            + "	select sp.*, sum(dh.so_luong) as so_luong_ban\r\n"
            + "	from donhang dh, sanpham sp, danhsachdonhang dsdh\r\n"
            + "	where dh.id_sp = sp.id and dh.id_dsdh = dsdh.id and dsdh.ngay_nhan is not null\r\n"
            + "	group by sp.id\r\n"
            + ") as a1\r\n"
            + "left join\r\n"
            + "(\r\n"
            + "	select dg.id_sp, round(cast(sum(dg.so_sao_vote) as numeric) / count(*), 1) as so_sao_vote\r\n"
            + "	from danhgia dg\r\n"
            + "	group by dg.id_sp\r\n"
            + ") as a2\r\n"
            + "on a1.id = a2.id_sp\r\n"
            + "order by so_sao_vote desc\r\n"
            + "limit 4;"
        );
        return resultSet.map(item => {
            const sanPham: SanPham = SanPham.toSanPhamEnity(item);
            return sanPham;
        });
    }

    async timKiemSanPhamByTen(tenSanPham: string, page: number): Promise<any[]> {
        const resultSet: any[] = await this.repo.query(
            "select a1.*, a2.so_sao_vote\r\n"
            + "from \r\n"
            + "(\r\n"
            + "	select sp.*, sum(dh.so_luong) as so_luong_ban\r\n"
            + "	from donhang dh, sanpham sp, danhsachdonhang dsdh\r\n"
            + "	where dh.id_sp = sp.id and dh.id_dsdh = dsdh.id and dsdh.ngay_nhan is not null and to_tsvector('english', lower(unaccent(sp.ten))) @@ to_tsquery('english', lower(unaccent($1)))\r\n"
            + "	group by sp.id\r\n"
            + ") as a1\r\n"
            + "left join\r\n"
            + "(\r\n"
            + "	select dg.id_sp, round(cast(sum(dg.so_sao_vote) as numeric) / count(*), 1) as so_sao_vote\r\n"
            + "	from danhgia dg\r\n"
            + "	group by dg.id_sp\r\n"
            + ") as a2\r\n"
            + "on a1.id = a2.id_sp\r\n"
            + "order by so_luong_ban desc, so_sao_vote desc\r\n"
            + "limit 12 offset $2;",
            [tenSanPham, (page - 1) * 12]
        );
        return resultSet.map(item => {
            const sanPham: SanPham = SanPham.toSanPhamEnity(item);
            return sanPham;
        });
    }
}