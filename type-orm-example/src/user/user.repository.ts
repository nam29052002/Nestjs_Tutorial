import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from './user.dto';
import { Bcrypt } from '../utils/utils.bcrypt';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  public getRepo(): Repository<User> {
    return this.repo;
  }

  async getUserByIdOrEmail(param: string | number): Promise<User> {
    let resultSet: User[];
    if (typeof param == 'number') {
      resultSet = await this.repo.query(
        'select * from "user" where id = $1;',
        [param],
      );
    } else {
      resultSet = await this.repo.query(
        'select * from "user" where email = $1;',
        [param],
      );
    }
    // console.log(resultSet);
    if (resultSet.length == 0) {
      return null;
    }
    return User.itemMapToUser(resultSet[0]);
  }

  async getUserByEmail(email: string): Promise<User> {
    const resultSet = await this.repo.query(
      'select * from "user" where email = $1;',
      [email],
    );
    if (resultSet.length == 0) {
      return null;
    }
    return User.itemMapToUser(resultSet[0]);
  }

  async searchUserByName(name: string, page: number): Promise<User[]> {
    const res: any[] = await this.repo.query(
      `select * from "user" where to_tsquery(lower(unaccent($1))) @@ to_tsvector('english', ten)
            limit 10 offset $2;
            `,
      [name, (page - 1) * 10],
    );
    return res.map((item) => {
      return User.itemMapToUser(item);
    });
  }

  async createUser(userDTO: UserDTO): Promise<void> {
    await this.repo.query(
      `insert into "user"(ten, email, mat_khau, anh, vai_tro)
            values($1, $2, $3, $4, $5);`,
      [
        userDTO.ten,
        userDTO.email,
        Bcrypt.encodePassword(userDTO.matKhau),
        userDTO.anh,
        userDTO.vaiTro,
      ],
    );
  }

  async updateUserByIdOrEmail(
    param: number | string,
    userDTO: UserDTO,
  ): Promise<void> {
    if (typeof param == 'number') {
      await this.repo.query(
        `update "user"
                set ten = $1, mat_khau = $2, anh = $3, vai_tro = $4
                where id = $5;`,
        [
          userDTO.ten,
          Bcrypt.encodePassword(userDTO.matKhau),
          userDTO.anh,
          userDTO.vaiTro,
          param,
        ],
      );
    } else {
      await this.repo.query(
        `update "user"
                set ten = $1, mat_khau = $2, anh = $3, vai_tro = $4
                where email = $5;`,
        [
          userDTO.ten,
          Bcrypt.encodePassword(userDTO.matKhau),
          userDTO.anh,
          userDTO.vaiTro,
          param,
        ],
      );
    }
  }

  async deleteUserByIdOrEmail(param: string | number): Promise<void> {
    if (typeof param == 'number') {
      await this.repo.query(
        `delete from "user"
                where id = $1`,
        [param],
      );
    } else {
      await this.repo.query(
        `delete from "user"
                where email = $1`,
        [param],
      );
    }
  }
}
