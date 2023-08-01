import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./authen.service";
import { ConfigService } from "@nestjs/config";
import { Bcrypt } from "src/utils/utils.bcrypt";
import { UserService } from "src/user/user.service";
import { UserDTO } from "src/user/user.dto";
import { HttpCode } from "@nestjs/common/decorators";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) {
        Bcrypt.SALT = this.configService.get<number>('BCRYPT_SALT');
    }

    @Post('login')
    @HttpCode(200)
    async login(
        @Body('email') email: string,
        @Body('password') password: string
    ): Promise<{ accessToken: string } | { errorMessage: string }> {
        if (email == null || password == null) {
            return Promise.resolve({ errorMessage: 'username or password is not null' });
        }
        var userDTO: UserDTO = null;
        userDTO = await this.userService.getUserByEmail(email, true);
        if (userDTO == null) {
            return new Promise(function(resolve, reject) {
                resolve({ errorMessage: 'email is not register' });
            });
        }
        if (Bcrypt.compare(password, userDTO.matKhau)) {
            return await this.authService.generateToken(userDTO.id, userDTO.email, (userDTO.vaiTro == 'a') ? true : false);
        }
        return { errorMessage: 'password is not correct' };
    }
}