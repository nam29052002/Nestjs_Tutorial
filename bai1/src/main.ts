import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe()) // global pipe
  
  const PORT: number = 3000;
  await app.listen(PORT);
  console.log(`app start at port ${PORT}`);
}
bootstrap();
