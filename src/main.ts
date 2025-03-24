import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { setup } from './setup';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : [];
  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  setup(app);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
