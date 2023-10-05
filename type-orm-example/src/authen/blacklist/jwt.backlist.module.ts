import { Module } from '@nestjs/common';
import { JwtBlaclistService } from './jwt.blacklist.service';
import { JwtBlaclistGuard } from './jwt.blacklist.guard';
import { ActiveModule } from '../active/active.module';

@Module({
  imports: [ActiveModule],
  providers: [JwtBlaclistService, JwtBlaclistGuard],
  exports: [JwtBlaclistService, JwtBlaclistGuard],
})
export class JwtBacklistModule {}
