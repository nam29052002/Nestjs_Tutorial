import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SanPhamChiTietDTO, SanPhamDTO } from "./sanpham.dto";

@Entity({name: 'user'})
export class SanPham {

    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column({name: 'ten', length: 255})
    tenSanPham: string;

    soSaoVoteTrungBinh: number;

    @Column({name: 'so_luong_nhap'})
    soLuongNhap: number;

    soLuongBan: number;

    @Column({name: 'tien_tren_don_vi'})
    giaSanPham: number;

    @Column({name: 'don_vi', length: 255})
    donVi: string;

    @Column({name: 'nguon_goc', length: 255})
    nguonGoc: string;

    tinhTrang: string;

    @Column({name: 'so_luong_ten_don_vi', length: 255})
    soLuongTrenDonVi: string;

    @Column({name: 'tom_tat', length: 2000})
    tomTat: string;

    @Column({name: 'vi', length: 255})
    vi: string;

    @Column({name: 'dinh_duong', length: 2000})
    dinhDuong: string;

    @Column({name: 'bao_quan', length: 1000})
    baoQuan: string;

    @Column({name: 'anh', length: 255})
    anh: string;

    @Column({name: 'phan_loai', length: 45})
    phanLoai: string;

    static mapToSanPhamDTO(sanPham: SanPham): SanPhamDTO {
        const {nguonGoc, soLuongTrenDonVi, tomTat, vi, dinhDuong, baoQuan, soLuongNhap, tinhTrang, phanLoai, ...sanPhamDTO} = sanPham;
        return sanPhamDTO;
    }

    static mapToSanPhamChiTietDTO(sanPham: SanPham): SanPhamChiTietDTO {
        const {soLuongNhap, ...sanPhamChiTietDTO} = sanPham;
        return sanPhamChiTietDTO;
    }

    static toSanPhamEnity(item: any): SanPham {
        let sanPham: SanPham = {
            id: item.id,
            tenSanPham: item.ten,
            donVi: item.don_vi,
            giaSanPham: item.tien_tren_don_vi,
            nguonGoc: item.nguon_goc,
            soLuongNhap: item.so_luong_nhap,
            soLuongTrenDonVi: item.so_luong_tren_don_vi,
            tomTat: item.tom_tat,
            dinhDuong: item.dinh_duong,
            baoQuan: item.bao_quan,
            anh: item.anh,
            phanLoai: item.phan_loai,
            soLuongBan: item.so_luong_ban,
            soSaoVoteTrungBinh: -1,
            vi: item.vi,
            tinhTrang: 'Còn hàng'
        };
        sanPham.tinhTrang = (sanPham.soLuongNhap > sanPham.soLuongBan) ? 'Còn hàng' : 'Hết hàng';
        if (item.so_sao_vote != null) {
            sanPham = {...sanPham, soSaoVoteTrungBinh: item.so_sao_vote};
        }
        return sanPham;
    }
}