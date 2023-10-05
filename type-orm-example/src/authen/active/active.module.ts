import { Module } from '@nestjs/common';
import { ActiveService } from './active.service';
import { ActiveRepository } from './active.repository';
import { Active } from './active.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Active]),
    // ConfigModule.forRoot({
    //   envFilePath: '.env',
    //   ignoreEnvFile: false,
    // }),
  ],
  providers: [ActiveService, ActiveRepository],
  exports: [ActiveService],
})
export class ActiveModule {}
