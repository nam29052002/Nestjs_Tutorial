import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async generateToken(userId: number, email: string, isAdmin: boolean): Promise<{accessToken: string}> {
        const payload = {
            sub: userId,
            email: email,
            admin: isAdmin
        }
        // console.log(this.configService.get<string>('JWT_SECRET'));
        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '10m',
            secret: this.configService.get<string>('JWT_SECRET')
        });

        return { accessToken: token };
    }
}