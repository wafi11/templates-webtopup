import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { Digiflazz } from 'src/integrations/digiflazz/http.request';
import { CategoriesRepositories } from './categories/categories.repository';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { PRODUCT_SYNC_QUEUE } from './queue/product-sync.queue';
import { SubProductRepository } from './subproducts/subproduct.repository';

@Module({
  imports: [
    BullModule.registerQueue({
      name: PRODUCT_SYNC_QUEUE,
    }),
  ],
  providers: [
    ProductService,
    CategoriesRepositories,
    SubProductRepository,
    ProductRepository,
    Digiflazz,
  ],
  controllers: [ProductController],
})
export class ProductModule {}
