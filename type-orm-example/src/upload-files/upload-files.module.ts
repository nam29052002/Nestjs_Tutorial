import { Module } from '@nestjs/common';
import { UploadFilesController } from './upload-files.controller';

@Module({
  controllers: [UploadFilesController],
})
export class UploadFilesModule {}
