import { Injectable } from '@nestjs/common';
import {
  convertToTimestamp,
  RequestParams,
  RequestVoucher,
  Voucher,
} from '@repo/types';
import { eq } from 'drizzle-orm';
import { InjectDb } from 'src/db/db.provider';
import type { DB } from 'src/db/db.provider';
import { voucherTable } from 'src/db/schema';

@Injectable()
export class VoucherRepository {
  constructor(@InjectDb() private db: DB) {}

  async Create(req: RequestVoucher): Promise<Voucher> {
    const [data] = await this.db
      .insert(voucherTable)
      .values({
        ...req,
        end_at: req.endAt,
        started_at: req.startedAt,
        calculation_type: req.calculationType,
        current_usage: req.currentUsage,
        margin_percentage: req.marginPercentage,
        margin_amount: req.marginAmount,
        max_usage: req.maxUsage,
        products: req.productIds,
        update_at: new Date(),
        max_usage_per_user: req.maxUsagePerUser,
        only_product: req.onlyProduct,
      })
      .returning();

    return {
      ...data,
      created_at: convertToTimestamp(data.created_at as Date),
      update_at: convertToTimestamp(data.update_at as Date),
      started_at: convertToTimestamp(data.started_at),
      end_at: convertToTimestamp(data.end_at),
    };
  }

  async FindAll(req: RequestParams): Promise<Voucher[]> {
    const data = await this.db
      .select()
      .from(voucherTable)
      .limit(req.limit)
      .offset(req.offset);

    return data.map((item) => ({
      ...item,
      created_at: convertToTimestamp(item.created_at as Date),
      update_at: convertToTimestamp(item.update_at as Date),
      started_at: convertToTimestamp(item.started_at),
      end_at: convertToTimestamp(item.end_at),
    }));
  }

  async FindOneByCode(code: string): Promise<Voucher> {
    const [data] = await this.db
      .select()
      .from(voucherTable)
      .where(eq(voucherTable.code, code));
    return {
      ...data,
      created_at: convertToTimestamp(data.created_at as Date),
      update_at: convertToTimestamp(data.update_at as Date),
      started_at: convertToTimestamp(data.started_at),
      end_at: convertToTimestamp(data.end_at),
    };
  }

  async Update(req: RequestVoucher, id: number): Promise<Voucher> {
    const [data] = await this.db
      .update(voucherTable)
      .set({
        ...req,
        end_at: req.endAt,
        started_at: req.startedAt,
        calculation_type: req.calculationType,
        current_usage: req.currentUsage,
        margin_percentage: req.marginPercentage,
        margin_amount: req.marginAmount,
        max_usage: req.maxUsage,
        products: req.productIds,
        update_at: new Date(),

        max_usage_per_user: req.maxUsagePerUser,
        only_product: req.onlyProduct,
      })
      .where(eq(voucherTable.id, id))
      .returning();
    return {
      ...data,
      created_at: convertToTimestamp(data.created_at as Date),
      update_at: convertToTimestamp(data.update_at as Date),
      started_at: convertToTimestamp(data.started_at),
      end_at: convertToTimestamp(data.end_at),
    };
  }

  async Delete(id: number): Promise<Voucher> {
    const [data] = await this.db
      .delete(voucherTable)
      .where(eq(voucherTable.id, id))
      .returning();
    return {
      ...data,
      created_at: convertToTimestamp(data.created_at as Date),
      update_at: convertToTimestamp(data.update_at as Date),
      started_at: convertToTimestamp(data.started_at),
      end_at: convertToTimestamp(data.end_at),
    };
  }
}
