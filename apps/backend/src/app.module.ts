import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { CategoriesModule } from './modules/products/categories/categories.module';

@Module({
  imports: [DbModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
