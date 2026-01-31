import { Module } from '@nestjs/common';
import { ProductItemsController } from './product-items.controller';
import { ProductItemsService } from './product-items.service';
import { ProductItemsRepository } from './product-items.repository';

@Module({
  controllers: [ProductItemsController],
  providers: [ProductItemsService, ProductItemsRepository],
})
export class ProductItemsModules {}
