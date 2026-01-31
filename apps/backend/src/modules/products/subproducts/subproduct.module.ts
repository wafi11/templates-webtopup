import { Module } from '@nestjs/common';
import { SubProductRepository } from './subproduct.repository';
import { SubProductService } from './subproduct.service';
import { SubProductController } from './subproduct.controller';

@Module({
  providers: [SubProductRepository, SubProductService],
  controllers: [SubProductController],
})
export class SubProductModule {}
