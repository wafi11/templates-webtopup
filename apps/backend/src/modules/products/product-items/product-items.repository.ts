import { Injectable, Logger } from '@nestjs/common';
import { InjectDb } from 'src/db/db.provider';
import type { DB } from 'src/db/db.provider';
import {
  convertToTimestamp,
  ProductItems,
  ProductItemsRequest,
  RequestParams,
} from '@repo/types';
import { productItemsTable } from 'src/db/schema';
import { and, asc, eq } from 'drizzle-orm';

@Injectable()
export class ProductItemsRepository {
  private readonly logger = new Logger(ProductItemsRepository.name);

  constructor(@InjectDb() private readonly db: DB) {}

  async Create(req: ProductItemsRequest): Promise<ProductItems> {
    try {
      this.logger.log(`Creating new product item with name: ${req.name}`);
      this.logger.debug(`Request payload: ${JSON.stringify(req)}`);

      const [data] = await this.db
        .insert(productItemsTable)
        .values({
          ...req,
          stock: req.stock as number,
          sub_product_id: req.subProductId,
          is_best_seller: req.isBestSeller,
          discount_price: req.discountPrice,
          base_price: req.basePrice,
          is_active: req.isActive,
        })
        .returning();

      this.logger.log(`Product item created successfully with ID: ${data.id}`);
      this.logger.debug(`Created data: ${JSON.stringify(data)}`);

      return {
        ...data,
        created_at: convertToTimestamp(data.created_at),
        updated_at: convertToTimestamp(data.updated_at),
      };
    } catch (error) {
      this.logger.error(
        `Failed to create product item: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async FindAll(req: RequestParams): Promise<ProductItems[]> {
    try {
      this.logger.log(
        `Fetching product items with limit: ${req.limit}, offset: ${req.offset}`,
      );

      const data = await this.db
        .select()
        .from(productItemsTable)
        .limit(req.limit)
        .offset(req.offset);

      this.logger.log(`Found ${data.length} product items`);
      this.logger.debug(`Product items data: ${JSON.stringify(data)}`);

      return data.map((item) => ({
        ...item,
        created_at: convertToTimestamp(item.created_at),
        updated_at: convertToTimestamp(item.updated_at),
      }));
    } catch (error) {
      this.logger.error(
        `Failed to fetch product items: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
  async FindAllByProductId(
    productId: number,
    subProductId: number,
  ): Promise<ProductItems[]> {
    try {
      const conditions = [eq(productItemsTable.product_id, productId)];

      if (subProductId !== 0) {
        conditions.push(eq(productItemsTable.sub_product_id, subProductId));
      }

      const data = await this.db
        .select()
        .from(productItemsTable)
        .where(and(...conditions))
        .orderBy(
          asc(productItemsTable.sub_product_id),
          asc(productItemsTable.base_price),
        );

      return data.map((item) => ({
        ...item,
        created_at: convertToTimestamp(item.created_at),
        updated_at: convertToTimestamp(item.updated_at),
      }));
    } catch (error) {
      this.logger.error(
        `Failed to fetch product items: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async Update(req: ProductItemsRequest, id: number): Promise<ProductItems> {
    try {
      this.logger.log(`Updating product item with ID: ${id}`);
      this.logger.debug(`Update payload: ${JSON.stringify(req)}`);

      const [data] = await this.db
        .update(productItemsTable)
        .set({
          ...req,
          stock: req.stock as number,
          sub_product_id: req.subProductId,
          is_best_seller: req.isBestSeller,
          discount_price: req.discountPrice,
          base_price: req.basePrice,
          is_active: req.isActive,
        })
        .where(eq(productItemsTable.id, id))
        .returning();

      if (!data) {
        this.logger.warn(`Product item with ID ${id} not found for update`);
        throw new Error(`Product item with ID ${id} not found`);
      }

      this.logger.log(`Product item with ID: ${id} updated successfully`);
      this.logger.debug(`Updated data: ${JSON.stringify(data)}`);

      return {
        ...data,
        created_at: convertToTimestamp(data.created_at),
        updated_at: convertToTimestamp(data.updated_at),
      };
    } catch (error) {
      this.logger.error(
        `Failed to update product item with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async Delete(id: number): Promise<boolean> {
    try {
      this.logger.log(`Deleting product item with ID: ${id}`);

      const [data] = await this.db
        .delete(productItemsTable)
        .where(eq(productItemsTable.id, id))
        .returning();

      if (!data) {
        this.logger.warn(`Product item with ID ${id} not found for deletion`);
        return false;
      }

      this.logger.log(`Product item with ID: ${id} deleted successfully`);
      this.logger.debug(`Deleted data: ${JSON.stringify(data)}`);

      return !!data;
    } catch (error) {
      this.logger.error(
        `Failed to delete product item with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
