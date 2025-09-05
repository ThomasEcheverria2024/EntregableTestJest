import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades extra
      forbidNonWhitelisted: true, // lanza error si hay props desconocidas
    }),
  );

  await app.listen(3000);
}
bootstrap();