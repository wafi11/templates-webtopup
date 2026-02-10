import { Injectable } from '@nestjs/common';
import { FormFields, RequestFormField, RequestParams } from '@repo/types';
import { eq } from 'drizzle-orm';
import { InjectDb } from 'src/db/db.provider';
import type { DB } from 'src/db/db.provider';
import { formFieldsTable, productsTable } from 'src/db/schema';

@Injectable()
export class FormFieldsRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async Create(req: RequestFormField): Promise<FormFields> {
    const [data] = await this.db
      .insert(formFieldsTable)
      .values({
        ...req,
        product_id: req.productId,
        values_option: req.valuesOption,
      })
      .returning();

    return data;
  }

  async FindAll(req: RequestParams, productId: number): Promise<FormFields[]> {
    const data = await this.db
      .select(
        {
           id: formFieldsTable.id,
            order: formFieldsTable.order,
            product_id: formFieldsTable.product_id,
            label: formFieldsTable.label,
            value: formFieldsTable.value,
            type: formFieldsTable.type,
            values_option: formFieldsTable.values_option,
            product_name : productsTable.name
        }
      )
      .from(formFieldsTable)
      .where(
        productId !== 0 ? eq(formFieldsTable.product_id, productId) : undefined,
      ).leftJoin(productsTable,eq(productsTable.id,formFieldsTable.product_id))
      .limit(req.limit)
      .offset(req.offset);
    return data;
  }

  async Update(req: RequestFormField, id: number): Promise<FormFields> {
    const [data] = await this.db
      .update(formFieldsTable)
      .set({
        ...req,
      })
      .where(eq(formFieldsTable.id, id))
      .returning();
    return data;
  }

  async Delete(id: number): Promise<FormFields> {
    const [data] = await this.db
      .delete(formFieldsTable)
      .where(eq(formFieldsTable.id, id))
      .returning();
    return data;
  }
}
