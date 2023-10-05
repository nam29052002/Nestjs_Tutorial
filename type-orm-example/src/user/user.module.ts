import { Module, forwardRef } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtBacklistModule } from '../authen/blacklist/jwt.backlist.module';
import { AuthorModule } from '../author/author.module';
import { ActiveModule } from '../authen/active/active.module';
import { AuthenModule } from '../authen/authen.module';
import { DanhGiaModule } from '../danhgia/danhgia.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtBacklistModule,
    AuthorModule,
    ActiveModule,
    forwardRef(() => AuthenModule),
    forwardRef(() => DanhGiaModule)
  ],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {}
