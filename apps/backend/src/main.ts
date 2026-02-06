import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-execption.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Global prefix
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(5000);
  console.log('🚀 Application is running on: http://localhost:5000');
}
bootstrap();

// try {
//   // Get queue instance dari NestJS
//   const productSyncQueue = app.get<Queue>('BullQueue_product-sync');

//   // Setup Bull Board
//   const serverAdapter = new ExpressAdapter();
//   serverAdapter.setBasePath('/admin/queues');

//   createBullBoard({
//     queues: [new BullAdapter(productSyncQueue)],
//     serverAdapter: serverAdapter,
//   });

//   // Mount ke Express
//   const expressApp = app.getHttpAdapter().getInstance();
//   expressApp.use('/admin/queues', serverAdapter.getRouter());

//   console.log('✅ Bull Board mounted at: http://localhost:5000/admin/queues');
// } catch (error) {
//   console.error('❌ Failed to setup Bull Board:', error.message);
//   console.error('Make sure Redis is running and queue is registered!');
// }
