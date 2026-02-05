import { Inject, Injectable } from '@nestjs/common';
import { InjectDb } from 'src/db/db.provider';
import type { DB } from 'src/db/db.provider';
import {
  convertToTimestamp,
  PaymentMethod,
  RequestParams,
  RequestValidationPaymentMethod,
} from '@repo/types';
import { paymentMethodTable, productItemsTable } from 'src/db/schema';
import { desc, eq } from 'drizzle-orm';

@Injectable()
export class PaymentMethodRepository {
  constructor(@InjectDb() private readonly db: DB) {}

  async Create(req: RequestValidationPaymentMethod): Promise<PaymentMethod> {
    const [data] = await this.db
      .insert(paymentMethodTable)
      .values({
        ...req,
        margin_percentage: req.margin_percentage.toString(),
      })
      .returning();

    return {
      ...data,
      created_at: convertToTimestamp(data.created_at as Date),
      updated_at: convertToTimestamp(data.update_at as Date),
    };
  }

  async FindAll(params: RequestParams): Promise<PaymentMethod[]> {
    const data = await this.db
      .select()
      .from(paymentMethodTable)
      .limit(params.limit)
      .offset(params.offset)
      .orderBy(desc(paymentMethodTable.method));

    return data.map((item) => ({
      ...item,
      created_at: convertToTimestamp(item.created_at ?? (new Date() as Date)),
      updated_at: convertToTimestamp(item.update_at ?? (new Date() as Date)),
    }));
  }

  async Update(req: PaymentMethod) {
    const [data] = await this.db
      .update(paymentMethodTable)
      .set({
        calculation_type: req.calculation_type,
        code: req.code,
        description: req.description,
        image: req.image,
        margin_percentage: req.margin_percentage.toString(),
        name: req.name,
        margin_amount: req.margin_amount,
      })
      .where(eq(productItemsTable.id, req.id))
      .returning();

    return {
      ...data,
      created_at: convertToTimestamp(data.created_at as Date),
      updated_at: convertToTimestamp(data.update_at as Date),
    };
  }

  async Delete(id: number) {
    const [data] = await this.db
      .delete(paymentMethodTable)
      .where(eq(productItemsTable.id, id))
      .returning();

    return {
      ...data,
      created_at: convertToTimestamp(data.created_at as Date),
      update_at: convertToTimestamp(data.update_at as Date),
    };
  }
}
