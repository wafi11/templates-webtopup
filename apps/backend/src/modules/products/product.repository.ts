import { Injectable } from '@nestjs/common';
import {
  convertToTimestamp,
  Product,
  ProductRequest,
  RequestParams,
} from '@repo/types';
import { and, asc, eq, gt, like, sql } from 'drizzle-orm';
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
  /**
   * ProductRepository
   *
   * Repository class untuk mengelola operasi database produk.
   * Menggunakan Drizzle ORM untuk query builder.
   */

  /**
   * Membuat produk baru
   *
   * @param req - Data produk yang akan dibuat
   * @returns Promise<Product> - Produk yang berhasil dibuat dengan timestamp terkonversi
   *
   * @example
   * const newProduct = await productRepo.Create({
   *   name: "Laptop Gaming",
   *   slug: "laptop-gaming",
   *   subName: "ROG Series",
   *   categoryId: 1,
   *   bannerImage: "laptop.jpg",
   *   isActive: true
   * });
   */
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

  /**
   * Mencari produk dengan cursor-based pagination
   *
   * Menggunakan ID sebagai cursor untuk pagination yang efisien.
   * Mendukung pencarian berdasarkan nama produk.
   *
   * @param search - Kata kunci pencarian (opsional, kosongkan untuk semua produk)
   * @param limit - Jumlah maksimal hasil per halaman
   * @param cursor - Cursor dari halaman sebelumnya (ID produk terakhir)
   * @returns Promise dengan data produk dan cursor untuk halaman berikutnya
   *
   * @example
   * // Halaman pertama
   * const page1 = await productRepo.SearchProducts("laptop", 10);
   * // { data: [...], nextCursor: "15" }
   *
   * // Halaman berikutnya
   * const page2 = await productRepo.SearchProducts("laptop", 10, page1.nextCursor);
   * // { data: [...], nextCursor: "25" }
   *
   * // Jika nextCursor null, berarti sudah halaman terakhir
   */
  async SearchProducts(
    search: string,
    limit: number,
    cursor?: string,
  ): Promise<{
    data: { id: number; name: string }[];
    nextCursor: string | null;
  }> {
    // Parse cursor menjadi ID (default 0 untuk halaman pertama)
    const cursorId = cursor ? parseInt(cursor) : 0;

    // Query dengan filter cursor dan search
    const data = await this.db
      .select({
        id: productsTable.id,
        name: productsTable.name,
      })
      .from(productsTable)
      .where(
        search
          ? and(
              gt(productsTable.id, cursorId),
              like(productsTable.name, `%${search}%`),
            )
          : gt(productsTable.id, cursorId),
      )
      .orderBy(asc(productsTable.id))
      .limit(limit + 1); // +1 untuk cek apakah ada halaman berikutnya

    // Cek apakah ada data lebih
    const hasMore = data.length > limit;
    const results = hasMore ? data.slice(0, limit) : data;

    // Generate cursor berikutnya dari ID item terakhir
    const nextCursor =
      hasMore && results.length > 0
        ? results[results.length - 1].id.toString()
        : null;

    return {
      data: results,
      nextCursor,
    };
  }

  /**
   * Mengambil semua produk dengan offset-based pagination
   *
   * @param req - Parameter request dengan limit dan offset
   * @param req.limit - Jumlah maksimal data yang diambil
   * @param req.offset - Jumlah data yang dilewati (skip)
   * @returns Promise<Product[]> - Array produk dengan timestamp terkonversi
   *
   * @example
   * // Halaman 1 (10 item pertama)
   * const products = await productRepo.FindAll({ limit: 10, offset: 0 });
   *
   * // Halaman 2 (10 item berikutnya)
   * const products2 = await productRepo.FindAll({ limit: 10, offset: 10 });
   */
  async FindAll(req: RequestParams, category: number): Promise<Product[]> {
    const data = await this.db
      .select()
      .from(productsTable)
      .where(
        category !== 0 ? eq(productsTable.category_id, category) : undefined,
      )
      .limit(req.limit)
      .offset(req.offset);

    return data.map((item) => ({
      ...item,
      created_at: convertToTimestamp(item.created_at),
      updated_at: convertToTimestamp(item.updated_at),
    }));
  }

  /**
   * Mencari produk berdasarkan slug
   *
   * Pencarian case-insensitive menggunakan uppercase normalization.
   *
   * @param req - Slug produk yang dicari
   * @returns Promise<Product> - Produk yang ditemukan dengan timestamp terkonversi
   * @throws Error jika produk tidak ditemukan (array destructuring akan undefined)
   *
   * @example
   * const product = await productRepo.FindBySlug("laptop-gaming-rog");
   */
  async FindBySlug(req: string): Promise<Product> {
    const normalized = normalizedProductSlug(req);
    const [data] = await this.db
      .select()
      .from(productsTable)
      .where(sql`upper(${productsTable.slug}) = ${normalized}`);

    return {
      ...data,
      created_at: convertToTimestamp(data.created_at ?? new Date()),
      updated_at: convertToTimestamp(data.updated_at ?? new Date()),
    };
  }

  /**
   * Mengupdate produk berdasarkan ID
   *
   * @param req - Data produk yang akan diupdate
   * @param id - ID produk yang akan diupdate
   * @returns Promise<Product> - Produk yang berhasil diupdate dengan timestamp terkonversi
   *
   * @example
   * const updated = await productRepo.Update({
   *   name: "Laptop Gaming Updated",
   *   slug: "laptop-gaming-updated",
   *   subName: "ROG Series 2024",
   *   categoryId: 1,
   *   bannerImage: "laptop-new.jpg",
   *   isActive: true
   * }, 5);
   */
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

  /**
   * Menghapus produk berdasarkan ID
   *
   * @param id - ID produk yang akan dihapus
   * @returns Promise<boolean> - true jika berhasil dihapus, false jika produk tidak ditemukan
   *
   * @example
   * const deleted = await productRepo.Delete(5);
   * if (deleted) {
   *   console.log("Produk berhasil dihapus");
   * }
   */
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
