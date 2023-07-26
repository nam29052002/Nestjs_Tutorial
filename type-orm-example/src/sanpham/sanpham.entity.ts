import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SanPhamDTO } from "./sanpham.dto";
import { SanPhamChiTietDTO } from "./sanpham.chi-tiet.dto";

@Entity({name: 'user'})
export class SanPham {

    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column({name: 'ten'})
    tenSanPham: string;

    soSaoVoteTrungBinh: number;

    @Column({name: 'so_luong_nhap'})
    soLuongNhap: number;

    soLuongBan: number;

    @Column({name: 'tien_tren_don_vi'})
    giaSanPham: number;

    @Column({name: 'don_vi'})
    donVi: string;

    @Column({name: 'nguon_goc'})
    nguonGoc: string;

    tinhTrang: string;

    @Column({name: 'so_luong_ten_don_vi'})
    soLuongTrenDonVi: string;

    @Column({name: 'tom_tat'})
    tomTat: string;

    @Column({name: 'vi'})
    vi: string;

    @Column({name: 'dinh_duong'})
    dinhDuong: string;

    @Column({name: 'bao_quan'})
    baoQuan: string;

    @Column({name: 'anh'})
    anh: string;

    @Column({name: 'phan_loai'})
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