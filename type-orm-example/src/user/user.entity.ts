import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserDTO } from './user.dto';
import { DanhGia } from '../danhgia/danhgia.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'ten', length: 255, nullable: false })
  ten: string;

  @Column({ name: 'email', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ name: 'mat_khau', length: 255, nullable: false })
  matKhau: string;

  @Column({ name: 'anh', length: 255 })
  anh: string;

  @Column({ name: 'vai_tro', length: 1, nullable: false })
  vaiTro: string;

  @OneToMany(() => DanhGia, danhGia => danhGia.user)
  listDanhGia?: DanhGia[];

  static itemMapToUser(item: any): User {
    return {
      id: item.id,
      ten: item.ten,
      email: item.email,
      matKhau: item.mat_khau,
      anh: item.anh,
      vaiTro: item.vai_tro,
    };
  }

  static mapToUserDTO(user: User): UserDTO {
    return {
      id: user.id,
      ten: user.ten,
      email: user.email,
      matKhau: user.matKhau,
      anh: user.anh,
      vaiTro: user.vaiTro,
      trangThai: 0,
    };
  }
}

export const userPropertiesMapper = {
  id: 'id',
  ten: 'ten',
  email: 'email',
  mat_khau: 'matKhau',
  anh: 'anh',
  vai_tro: 'vaiTro'
}
