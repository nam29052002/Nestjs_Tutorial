import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const filePath = path.join(__dirname, '..', 'files-store');
  // console.log(__dirname + '\n' + __filename);
  app.use(express.static(filePath));
  await app.listen(3000);
}
bootstrap();
