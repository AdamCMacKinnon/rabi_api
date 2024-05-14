import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.PORT || 5500;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(port);
  Logger.log(`App Running in ${process.env.STAGE} on port ${port}`);
}
bootstrap();
