import { Injectable } from '@nestjs/common';
import { ActiveRepository } from './active.repository';
import { Active } from './active.entity';
import { ConfigService } from '@nestjs/config';
import { Base64 } from '../../utils/utils.base64';

@Injectable()
export class ActiveService {
  private refreshTokenExpires: number;
  constructor(
    private readonly activeRepository: ActiveRepository,
    configService: ConfigService,
  ) {
    this.refreshTokenExpires = parseInt(
      configService.get<string>('REFRESH_TOKEN_EXPIRES'),
    );
  }

  async addToken(
    accessToken: string,
    refreshToken: string,
    idUser: number,
  ): Promise<void> {
    this.activeRepository.addToken(accessToken, refreshToken, idUser);
  }

  async isDestroyed(param: string | number): Promise<boolean> {
    return await this.activeRepository.isDestroyed(param);
  }

  async destroyToken(token: string): Promise<void> {
    return await this.activeRepository.destroyToken(token);
  }

  async updateToken(
    newAccessToken: string,
    newRefreshToken: string,
    oldAccessToken: string,
  ): Promise<void> {
    return await this.activeRepository.updateToken(
      newAccessToken,
      newRefreshToken,
      oldAccessToken,
    );
  }

  async isValid(accessToken: string, refreshToken: string): Promise<boolean> {
    const res: Active[] = await this.activeRepository.getTokenObject(
      accessToken,
    );
    if (res.length == 0) {
      return false;
    }
    if (res[0].refreshToken != refreshToken) {
      return false;
    }
    const [at, isoString] = Base64.decode(refreshToken).split(' ');
    console.log(at != accessToken);
    if (at != accessToken) {
      return false;
    }
    console.log(this.refreshTokenExpires);
    console.log(isoString);
    return (
      new Date().getTime() - new Date(isoString).getTime() <=
      this.refreshTokenExpires
    );
  }
}
