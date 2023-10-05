import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  forwardRef
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserDTO } from './user.dto';
import { plainToClass } from 'class-transformer';
import { Base64 } from '../utils/utils.base64';
import { JwtBlaclistService } from '../authen/blacklist/jwt.blacklist.service';
import { AuthenService } from '../authen/authen.service';
import { DanhGiaRepository } from '../danhgia/danhgia.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly backlistService: JwtBlaclistService,
    @Inject(forwardRef(() => DanhGiaRepository)) private readonly danhGiaRepository: DanhGiaRepository,
    @Inject(forwardRef(() => AuthenService)) private readonly authenService: AuthenService
  ) {}

  async getUserByIdOrEmail(id: number, expose: boolean): Promise<UserDTO> {
    const user: User = await this.userRepository.getUserByIdOrEmail(id);
    if (user == null) {
      throw new HttpException('User is not exists', 400);
    }
    if (expose == true) {
      return User.mapToUserDTO(user);
    }
    return plainToClass(UserDTO, user, { excludeExtraneousValues: true });
  }

  async getUserByEmail(email: string, expose: boolean): Promise<UserDTO> {
    const user: User = await this.userRepository.getUserByEmail(email);
    if (user == null) {
      throw new HttpException('User is not exists', 400);
    }
    if (expose == true) {
      return User.mapToUserDTO(user);
    }
    return plainToClass(UserDTO, user, { excludeExtraneousValues: true });
  }

  async searchUserByName(name: string, page: number): Promise<UserDTO[]> {
    const res: User[] = await this.userRepository.searchUserByName(name, page);
    return res.map((item) => {
      return plainToClass(UserDTO, item, { excludeExtraneousValues: true });
    });
  }

  async createUser(userDTO: UserDTO): Promise<{ status: string }> {
    if ((await this.userRepository.getRepo().findOneBy({ email: userDTO.email }))) {
      throw new HttpException('Email đã được đăng kí!', HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.createUser(userDTO);
    return { status: 'Tạo user thành công!' };
  }

  async registerUser(userDTO: UserDTO): Promise<{ accessToken: string, refreshToken: string }> {
    await this.createUser(userDTO);
    const userSaved = await this.userRepository.getRepo().findOneBy({ email: userDTO.email });
    const responseToken = await this.authenService.generateToken(
      userSaved.id,
      userSaved.email,
      userSaved.vaiTro == 'a' ? true : false,
    );
    const refreshToken = Base64.encode(
      responseToken.accessToken + ' ' + new Date().toISOString(),
    );
    await this.backlistService.addToBlacklist(
      responseToken.accessToken,
      refreshToken,
      userSaved.id,
    );
    return {
      accessToken: responseToken.accessToken,
      refreshToken: refreshToken,
    };
  }

  async updateUserByIdOrEmail(
    param: string | number,
    userDTO: UserDTO,
  ): Promise<{ status: string }> {
    if ((await this.userRepository.getUserByIdOrEmail(param)) == null) {
      throw new HttpException(
        'Id user không tồn tại !',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userRepository.updateUserByIdOrEmail(param, userDTO);
    return { status: 'Cập nhật user thành công!' };
  }

  async deleteUserByIdOrEmail(
    param: string | number,
  ): Promise<{ status: string }> {
    if ((await this.userRepository.getUserByIdOrEmail(param)) == null) {
      throw new HttpException(
        'Id user không tồn tại !',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (typeof param == 'string') {
      param = (await this.userRepository.getRepo().findOneBy({ email: param })).id;
    }
    await Promise.all([
      this.userRepository.deleteUserByIdOrEmail(param),
      this.danhGiaRepository.getRepo().delete({ idUser: param })
    ]);

    return { status: 'Xóa user thành công!' };
  }
}
