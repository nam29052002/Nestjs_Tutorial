import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../user/user.dto';
import { UserService } from '../user/user.service';
import { JwtBlaclistService } from './blacklist/jwt.blacklist.service';
import { Bcrypt } from '../utils/utils.bcrypt';
import { Base64 } from '../utils/utils.base64';
import { ActiveService } from './active/active.service';

@Injectable()
export class AuthenService {
  private readonly expiresIn: string;
  private readonly secret: string;
  constructor(
    private readonly jwtService: JwtService,
    configService: ConfigService,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly backlistService: JwtBlaclistService,
    private readonly activeService: ActiveService,
  ) {
    this.expiresIn = configService.get<string>('JWT_EXPIRES');
    this.secret = configService.get<string>('JWT_SECRET');
  }

  async generateToken(
    userId: number,
    email: string,
    isAdmin: boolean,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email: email,
      admin: isAdmin,
    };
    // console.log(this.configService.get<string>('JWT_SECRET'));
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.expiresIn,
      secret: this.secret,
    });

    return { accessToken: token };
  }

  async checkLogin(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (email == null || password == null) {
      throw new HttpException('username or password is not null', 400);
    }
    var userDTO: UserDTO = null;
    userDTO = await this.userService.getUserByEmail(email, true);
    if (userDTO == null) {
      throw new HttpException('email is not register', 400);
    }
    if (Bcrypt.compare(password, userDTO.matKhau)) {
      if (await this.backlistService.tokenInBlacklist(userDTO.id)) {
        throw new HttpException(
          'Tài khoản đang được đăng nhập tại nơi khác',
          401,
        );
      }
      const responseToken = await this.generateToken(
        userDTO.id,
        userDTO.email,
        userDTO.vaiTro == 'a' ? true : false,
      );
      const refreshToken = Base64.encode(
        responseToken.accessToken + ' ' + new Date().toISOString(),
      );
      await this.backlistService.addToBlacklist(
        responseToken.accessToken,
        refreshToken,
        userDTO.id,
      );
      return {
        accessToken: responseToken.accessToken,
        refreshToken: refreshToken,
      };
    }
    throw new HttpException('password is not correct', 400);
  }

  async refreshToken(
    accessToken: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (
      (await this.activeService.isValid(accessToken, refreshToken)) == false
    ) {
      console.log('ok');
      throw new HttpException('Un Authentication', HttpStatus.FORBIDDEN);
    }
    const payload = JSON.parse(Base64.decode(accessToken.split('.')[1]));
    console.log(payload);
    const id = parseInt(payload['sub'].toString());
    const email = payload['email'];
    const isAdmin = payload['admin'];
    const newAccessToken = (await this.generateToken(id, email, isAdmin))
      .accessToken;
    console.log(newAccessToken);
    const newRefreshToken = Base64.encode(
      newAccessToken + ' ' + new Date().toISOString(),
    );
    this.activeService.updateToken(
      newAccessToken,
      newRefreshToken,
      accessToken,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
