import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Categories,
  CategoriesRequest,
  CategoriesTable,
  convertToTimestamp,
  RequestParams,
} from '@repo/types';
import { eq, like } from 'drizzle-orm';
import { InjectDb } from 'src/db/db.provider';
import type { DB } from 'src/db/db.provider';
import { categoriesTable } from 'src/db/schema';

@Injectable()
export class CategoriesRepositories {
  constructor(@InjectDb() private readonly db: DB) {}

  async Create(req: CategoriesRequest): Promise<Categories> {
    const [categories] = await this.db
      .insert(categoriesTable)
      .values({
        ...req,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    return {
      ...categories,
      created_at: convertToTimestamp(categories.created_at),
      updated_at: convertToTimestamp(categories.updated_at),
    };
  }

  async FindAll(req: RequestParams): Promise<Categories[]> {
    let categories: CategoriesTable[];

    if (req.search) {
      categories = await this.db
        .select()
        .from(categoriesTable)
        .where(like(categoriesTable.name, `%${req.search}%`))
        .limit(req.limit)
        .offset(req.offset);
    } else {
      categories = await this.db
        .select()
        .from(categoriesTable)
        .limit(req.limit)
        .offset(req.offset);
    }

    return categories.map((item) => ({
      ...item,
      created_at: convertToTimestamp(item.created_at),
      updated_at: convertToTimestamp(item.updated_at),
    }));
  }

  async Update(req: CategoriesRequest, id: number): Promise<Categories> {
    const [categories] = await this.db
      .update(categoriesTable)
      .set({
        ...req,
        updated_at: new Date(),
      })
      .where(eq(categoriesTable.id, id))
      .returning();

    if (!categories) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return {
      ...categories,
      created_at: convertToTimestamp(categories.created_at),
      updated_at: convertToTimestamp(categories.updated_at),
    };
  }

  async Delete(id: number): Promise<boolean> {
    const [categories] = await this.db
      .delete(categoriesTable)
      .where(eq(categoriesTable.id, id))
      .returning();

    return !!categories;
  }
}
