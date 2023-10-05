import { Module, forwardRef } from "@nestjs/common";
import { AuthenService } from "./authen.service";
import { AuthenController } from "./authen.controller";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { JwtStrategy } from "./strategy/strategy.jwt-strategy";
import { JwtBacklistModule } from "./blacklist/jwt.backlist.module";
import { ActiveModule } from "./active/active.module";

@Module({
  imports: [
    JwtModule.register({}),
    // ConfigModule.forRoot({
    //   envFilePath: '.env',
    //   ignoreEnvFile: false
    // }),
    forwardRef(() => UserModule),
    JwtBacklistModule,
    ActiveModule
  ],
  providers: [AuthenService, JwtStrategy],
  controllers: [AuthenController],
  exports: [AuthenService]
})
export class AuthenModule {

}