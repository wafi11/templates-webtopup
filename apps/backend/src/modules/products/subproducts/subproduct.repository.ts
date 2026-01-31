import {
  convertToTimestamp,
  RequestParams,
  SubProduct,
  SubProductRequest,
} from '@repo/types';
import { eq } from 'drizzle-orm';
import { InjectDb } from 'src/db/db.provider';
import type { DB } from 'src/db/db.provider';
import { subProductsTable } from 'src/db/schema';

export class SubProductRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async Create(req: SubProductRequest): Promise<SubProduct> {
    const [data] = await this.db
      .insert(subProductsTable)
      .values({
        ...req,
        product_id: req.productId,
        is_active: req.isActive,
      })
      .returning();

    return {
      ...data,
      created_at: convertToTimestamp(data.created_at),
      updated_at: convertToTimestamp(data.updated_at),
    };
  }
  async FindAll(req: RequestParams): Promise<SubProduct[]> {
    const data = await this.db
      .select()
      .from(subProductsTable)
      .limit(req.limit)
      .offset(req.offset);

    return data.map((item) => ({
      ...item,
      created_at: convertToTimestamp(item.created_at),
      updated_at: convertToTimestamp(item.updated_at),
    }));
  }

  async Update(req: SubProductRequest, id: number): Promise<SubProduct> {
    const [data] = await this.db
      .update(subProductsTable)
      .set({ ...req, product_id: req.productId, is_active: req.isActive })
      .where(eq(subProductsTable.id, id))
      .returning();

    return {
      ...data,
      created_at: convertToTimestamp(data.created_at),
      updated_at: convertToTimestamp(data.updated_at),
    };
  }

  async Delete(id: number): Promise<SubProduct> {
    const [data] = await this.db
      .delete(subProductsTable)
      .where(eq(subProductsTable.id, id))
      .returning();

    return {
      ...data,
      created_at: convertToTimestamp(data.created_at),
      updated_at: convertToTimestamp(data.updated_at),
    };
  }
}
