import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { CategoriesModule } from './modules/products/categories/categories.module';
import { ProductModule } from './modules/products/product.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { QueueBoardModule } from './modules/queue/queue.board.module';
import { BullModule } from '@nestjs/bull';
import { SubProductModule } from './modules/products/subproducts/subproduct.module';
import { ProductItemsModules } from './modules/products/product-items/product-items.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host', 'localhost'),
          port: configService.get('redis.port', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    DbModule,
    CategoriesModule,
    ProductModule,
    SubProductModule,
    ProductItemsModules,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
