import { Injectable, Logger } from '@nestjs/common';
import { CategoriesRepositories } from './categories.repository';
import { Categories, CategoriesRequest, RequestParams } from '@repo/types';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private repo: CategoriesRepositories) {}

  async Create(req: CategoriesRequest) {
    return await this.repo.Create(req);
  }

  async FindAll(req: RequestParams): Promise<Categories[]> {
    this.logger.log('FindAll method called'); // 👈 Debug log

    return await this.repo.FindAll(req);
  }

  async Update(req: CategoriesRequest, id: number) {
    return await this.repo.Update(req, id);
  }

  async Delete(id: number) {
    return await this.repo.Delete(id);
  }
}
