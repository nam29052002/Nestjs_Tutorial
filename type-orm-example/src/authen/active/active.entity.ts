import { Length } from 'class-validator';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'active' })
export class Active {
  @PrimaryColumn({ name: 'access_token', nullable: false })
  @Length(1, 1000)
  accessToken: string;

  @Column({ name: 'refresh_token', nullable: false })
  @Length(1, 1000)
  refreshToken: string;

  @Column({ name: 'id_user', nullable: false })
  idUser: number;
}
