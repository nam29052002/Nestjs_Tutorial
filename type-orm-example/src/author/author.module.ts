import { Module } from '@nestjs/common';
import { AuthorAdminGuard } from './author.guard';

@Module({
  providers: [AuthorAdminGuard],
  exports: [AuthorAdminGuard],
})
export class AuthorModule {}
