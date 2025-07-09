import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env/even';
import { EnvService } from '@/infra/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //logger: false
  });

  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  console.log("Application started")

  await app.listen(port);
}
bootstrap()
