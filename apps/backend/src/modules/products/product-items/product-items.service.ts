import { Injectable } from '@nestjs/common';
import { ProductItemsRepository } from './product-items.repository';
import { ProductItemsRequest, RequestParams } from '@repo/types';

@Injectable()
export class ProductItemsService {
  constructor(private readonly repo: ProductItemsRepository) {}

  async Create(req: ProductItemsRequest) {
    return this.repo.Create(req);
  }

  async FindAll(req: RequestParams) {
    return await this.repo.FindAll(req);
  }

  async Update(req: ProductItemsRequest, id: number) {
    return await this.repo.Update(req, id);
  }

  async Delete(id: number) {
    return this.repo.Delete(id);
  }
}
