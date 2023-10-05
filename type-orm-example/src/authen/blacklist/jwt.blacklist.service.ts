import { Injectable } from '@nestjs/common';
import { ActiveService } from '../active/active.service';

@Injectable()
export class JwtBlaclistService {
  constructor(private readonly activeService: ActiveService) {}

  async addToBlacklist(
    accessToken: string,
    refreshToken,
    idUser: number,
  ): Promise<void> {
    return await this.activeService.addToken(accessToken, refreshToken, idUser);
  }

  async tokenInBlacklist(param: string | number): Promise<boolean> {
    return await this.activeService.isDestroyed(param);
  }

  async destroyToken(token: string): Promise<void> {
    return await this.activeService.destroyToken(token);
  }
}
