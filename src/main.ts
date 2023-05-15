import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser())
  await app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
  );
}

bootstrap();
