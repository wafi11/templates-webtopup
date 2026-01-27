import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { dataTest } from '@repo/types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const data: dataTest = {
    name: 'wafi',
  };
  console.log(data);
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
