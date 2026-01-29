import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepositories } from './categories.repository';

// 👇 Debug log
console.log('CategoriesController:', CategoriesController);
console.log('CategoriesService:', CategoriesService);
console.log('CategoriesRepositories:', CategoriesRepositories);
// console.log('DbModule:', DbModule);

@Module({
  imports: [],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepositories],
})
export class CategoriesModule {}
