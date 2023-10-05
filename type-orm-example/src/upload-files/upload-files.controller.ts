import {
  Controller,
  HttpException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('api/upload-files')
export class UploadFilesController {
  @UseInterceptors(
    FileInterceptor('fileImg', {
      // tham số thứ nhất trùng với tên file field submit từ client
      storage: diskStorage({
        destination: './files-store',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extname = path.extname(file.originalname);
          callback(null, `${file.fieldname}.${uniqueSuffix}${extname}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (
          /\.(jpg|jpeg|png)$/.test(path.extname(file.originalname)) == false
        ) {
          return callback(new HttpException('File type is image!', 400), false);
        }
        callback(null, true);
      },
      limits: {
        fieldSize: 5 * 1024 * 1024,
      },
    }),
  )
  @Post()
  async upload(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string; fileName: string; size: string }> {
    return {
      message: 'upload file success!',
      fileName: file.filename,
      size: `${file.size}B`,
    };
  }
}
