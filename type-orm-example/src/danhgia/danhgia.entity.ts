import { SanPham } from "../sanpham/sanpham.entity";
import { User } from "../user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('danhgia')
export class DanhGia {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'id_user' })
  idUser: number;

  @Column({ name: 'id_sp' })
  idSanPham: number;

  @Column({ name: 'noi_dung_binh_luan', length: 1000, nullable: false })
  noiDungBinhLuan: string;

  @Column({ name: 'so_sao_vote', nullable: false })
  soSaoVote: number;

  @Column({ name: 'ngay_binh_luan', nullable: false })
  ngayBinhLuan: Date;

  @ManyToOne(() => User, user => user.listDanhGia)
  @JoinColumn({ name: 'id_user', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => SanPham, sanPham => sanPham.listDanhGia)
  @JoinColumn({ name: 'id_sp', referencedColumnName: 'id' })
  sanPham: SanPham;
}

export const danhGiaPropertiesMapper = {
  id: 'id',
  id_user: 'idUser',
  id_sp: 'idSanPham',
  noi_dung_binh_luan: 'noiDungBinhLuan',
  so_sao_vote: 'soSaoVote',
  ngay_binh_luan: 'ngayBinhLuan'
}
