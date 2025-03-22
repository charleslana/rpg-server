import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { setup } from './setup';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:8090', 'http://localhost:4000', '*'],
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
