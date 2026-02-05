import { Injectable } from '@nestjs/common';
import {
  convertToTimestamp,
  Product,
  ProductRequest,
  RequestParams,
} from '@repo/types';
import { and, eq } from 'drizzle-orm';
import { InjectDb } from 'src/db/db.provider';
import type { DB } from 'src/db/db.provider';
import {
  categoriesTable,
  productItemsTable,
  productsTable,
  subProductsTable,
} from 'src/db/schema';
import { ProductDigiflazz } from 'src/integrations/digiflazz/digiflazz.dto';
import { normalizedProductSlug } from './helpers';

@Injectable()
export class ProductRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async Create(req: ProductRequest): Promise<Product> {
    const [data] = await this.db
      .insert(productsTable)
      .values({
        ...req,
        slug: req.slug,
        category_id: req.categoryId,
        sub_name: req.subName,
        banner_image: req.bannerImage,
        is_active: req.isActive,
      })
      .returning();

    return {
      ...data,
      created_at: convertToTimestamp(data.created_at),
      updated_at: convertToTimestamp(data.updated_at),
    };
  }
  async FindAll(req: RequestParams): Promise<Product[]> {
    const data = await this.db
      .select()
      .from(productsTable)
      .limit(req.limit)
      .offset(req.offset);
    return data.map((item) => ({
      ...item,
      created_at: convertToTimestamp(item.created_at),
      updated_at: convertToTimestamp(item.updated_at),
    }));
  }

  async FindBySlug(req: string): Promise<Product> {
    const normalized = normalizedProductSlug(req);
    const [data] = await this.db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, normalized));

    return {
      ...data,
      created_at: convertToTimestamp(data.created_at),
      updated_at: convertToTimestamp(data.updated_at),
    };
  }

  async Update(req: ProductRequest, id: number): Promise<Product> {
    const [data] = await this.db
      .update(productsTable)
      .set({
        ...req,
        banner_image: req.bannerImage,
        category_id: req.categoryId,
        is_active: req.isActive,
        sub_name: req.subName,
      })
      .where(eq(productsTable.id, id))
      .returning();

    return {
      ...data,
      created_at: convertToTimestamp(data.created_at),
      updated_at: convertToTimestamp(data.updated_at),
    };
  }

  async Delete(id: number): Promise<boolean> {
    const [data] = await this.db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();

    return !!data;
  }

  async GenerateDigiflazz(request: ProductDigiflazz) {
    return await this.db.transaction(async (tx) => {
      try {
        // Query dengan join untuk reduce round trips
        const productData = await tx
          .select({
            categoryId: categoriesTable.id,
            productId: productsTable.id,
            subProductId: subProductsTable.id,
          })
          .from(categoriesTable)
          .innerJoin(productsTable, eq(productsTable.slug, request.brand))
          .leftJoin(
            subProductsTable,
            and(
              eq(subProductsTable.code, request.type),
              eq(subProductsTable.product_id, productsTable.id),
            ),
          )
          .where(eq(categoriesTable.name, request.category))
          .limit(1)
          .then(([result]) => result);

        if (!productData) {
          console.warn(
            `Product or category not found for: ${request.brand} - ${request.category}`,
          );
          return null; // PENTING: return agar tidak lanjut ke bawah
        }

        // Upsert sub product jika belum ada
        let subProductId = productData.subProductId;

        if (!subProductId) {
          [{ id: subProductId }] = await tx
            .insert(subProductsTable)
            .values({
              name: request.type,
              product_id: productData.productId,
              code: request.type,
              order: 1,
              is_active: true,
            })
            .returning({ id: subProductsTable.id });
        }

        // Upsert product item
        const [productItem] = await tx
          .insert(productItemsTable)
          .values({
            sub_product_id: subProductId,
            base_price: request.price,
            name: request.product_name,
            code: request.buyer_sku_code,
            discount_price: 0,
            is_active:
              request.buyer_product_status && request.seller_product_status,
            order: 1,
            is_best_seller: false,
            stock: request.stock,
          })
          .onConflictDoUpdate({
            target: productItemsTable.code,
            set: {
              base_price: request.price,
              name: request.product_name,
              is_active:
                request.buyer_product_status && request.seller_product_status,
              stock: request.stock,
            },
          })
          .returning();

        return productItem;
      } catch (error) {
        // Catch any other errors and continue
        console.error(
          `Error processing ${request.buyer_sku_code}:`,
          error.message,
        );
        return null;
      }
    });
  }
}
