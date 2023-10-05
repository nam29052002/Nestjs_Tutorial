import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenService } from './authen.service';
import { ConfigService } from '@nestjs/config';
import { Bcrypt } from '../utils/utils.bcrypt';
import { Req } from '@nestjs/common/decorators';
import { Request } from 'express';
import { JwtBlaclistService } from './blacklist/jwt.blacklist.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtBlaclistGuard } from './blacklist/jwt.blacklist.guard';

@Controller('auth')
export class AuthenController {
  constructor(
    configService: ConfigService,
    private readonly authenService: AuthenService,
    private readonly backlistService: JwtBlaclistService,
  ) {
    Bcrypt.SALT_ROUND = parseInt(
      configService.get<string>('BCRYPT_SALT_ROUND'),
    );
  }

  @Post('login')
  async login(
    @Body() obj: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authenService.checkLogin(obj.email, obj.password);
  }

  @Get('logout')
  @UseGuards(AuthGuard('jwt'), JwtBlaclistGuard)
  async logout(@Req() request: Request): Promise<{ status: string }> {
    const token = request.headers.authorization?.split(' ')[1];
    if (token && this.backlistService.tokenInBlacklist(token)) {
      this.backlistService.destroyToken(token);
      return { status: 'Logout success' };
    }
    throw new HttpException('Access denied!', 403);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body('accessToken') accessToken: string,
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authenService.refreshToken(accessToken, refreshToken);
  }
}
