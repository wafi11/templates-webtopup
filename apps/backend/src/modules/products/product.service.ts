import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRequest, RequestParams } from '@repo/types';
import { Digiflazz } from 'src/integrations/digiflazz/http.request';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    private repo: ProductRepository,
    private digiflazz: Digiflazz,
  ) {}

  async Create(req: ProductRequest) {
    return await this.repo.Create(req);
  }

  async FindBySlug(req: string) {
    return await this.repo.FindBySlug(req);
  }

  async Search(search: string, limit: number, cursor?: string) {
    return await this.repo.SearchProducts(search, limit, cursor);
  }

  async FindAll(req: RequestParams, category: string) {
    const parseCategory = parseInt(category);
    if (typeof parseCategory != 'number') {
      throw new BadRequestException('Category Must Be Number');
    }
    return await this.repo.FindAll(req, parseCategory);
  }

  async Update(req: ProductRequest, id: number) {
    return await this.repo.Update(req, id);
  }

  async Delete(id: number) {
    return this.repo.Delete(id);
  }

  async GetProductsFromDigiflazz() {
    const products = await this.digiflazz.CheckPrice();
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };
    if (!products) {
      return 'Failed to Get Product From Digiflazz';
    }

    for (const product of products) {
      try {
        const result = await this.repo.GenerateDigiflazz(product);

        if (result) {
          results.success++;
        } else {
          results.failed++;
          results.errors.push(
            `${product.buyer_sku_code}: Product or category not found`,
          );
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`${product.buyer_sku_code}: ${error.message}`);
      }
    }

    console.log('Sync completed:', results);

    return 'Successfully Create';
  }
}
