import { Module } from "@nestjs/common";
import { AuthService } from "./authen.service";
import { AuthController } from "./authen.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "src/user/user.module";
import { JwtStrategy } from "./strategy/strategy.jwt-strategy";

@Module({
    imports: [
        JwtModule.register({}),
        ConfigModule.forRoot({
            envFilePath: '.env',
            ignoreEnvFile: false
        }),
        UserModule
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {

}