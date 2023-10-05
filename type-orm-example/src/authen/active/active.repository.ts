import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Active } from './active.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActiveRepository {
  constructor(
    @InjectRepository(Active) private readonly repo: Repository<Active>,
  ) {}

  async addToken(
    accessToken: string,
    refreshToken: string,
    idUser: number,
  ): Promise<void> {
    return await this.repo.query(
      'insert into active(access_token, refresh_token, id_user) values($1, $2, $3);',
      [accessToken, refreshToken, idUser],
    );
  }

  async isDestroyed(param: string | number): Promise<boolean> {
    let resultSet: any[];
    if (typeof param == 'string') {
      resultSet = await this.repo.query(
        'select * from active where access_token = $1;',
        [param],
      );
    } else {
      resultSet = await this.repo.query(
        'select * from active where id_user = $1;',
        [param],
      );
    }
    return resultSet.length > 0;
  }

  async destroyToken(token: string): Promise<void> {
    return await this.repo.query(
      'delete from active where access_token = $1;',
      [token],
    );
  }

  async updateToken(
    newAccessToken: string,
    newRefreshToken: string,
    oldAccessToken: string,
  ): Promise<void> {
    return await this.repo.query(
      `update active set access_token = $1, refresh_token = $2
            where access_token = $3;`,
      [newAccessToken, newRefreshToken, oldAccessToken],
    );
  }

  async getTokenObject(accessToken: string): Promise<Active[]> {
    const res: {
      access_token: string;
      refresh_token: string;
      id_user: number;
    }[] = await this.repo.query(
      `select * from active where access_token = $1;`,
      [accessToken],
    );
    return res.map((item) => {
      return {
        accessToken: item.access_token,
        refreshToken: item.refresh_token,
        idUser: item.id_user,
      };
    });
  }
}
