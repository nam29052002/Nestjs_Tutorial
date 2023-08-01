import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserDTO } from "./user.dto";

@Entity({name: 'user'})
export class User {
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column({name: 'ten', length: 255})
    ten: string;

    @Column({name: 'email', length: 255, unique: true})
    email: string;

    @Column({name: 'mat_khau', length: 255})
    matKhau: string;

    @Column({name: 'anh', length: 255})
    anh: string;

    @Column({name: 'vai_tro', length: 1})
    vaiTro: string;

    @Column({name: 'trang_thai'})
    trangThai: number;

    static itemMapTOUser(item: any): User {
        return {
            id: item.id,
            ten: item.ten,
            email: item.email,
            matKhau: item.mat_khau,
            anh: item.anh,
            vaiTro: item.vai_tro,
            trangThai: item.trang_thai
        }
    }
}