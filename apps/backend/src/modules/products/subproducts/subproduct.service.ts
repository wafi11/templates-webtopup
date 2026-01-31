import { Injectable } from '@nestjs/common';
import { SubProductRepository } from './subproduct.repository';
import { RequestParams, SubProductRequest } from '@repo/types';

@Injectable()
export class SubProductService {
  constructor(private repo: SubProductRepository) {}

  async Create(req: SubProductRequest) {
    return await this.repo.Create(req);
  }

  async FindAll(req: RequestParams) {
    return await this.repo.FindAll(req);
  }

  async Update(req: SubProductRequest, id: number) {
    return await this.repo.Update(req, id);
  }

  async Delete(id: number) {
    return this.repo.Delete(id);
  }
}
