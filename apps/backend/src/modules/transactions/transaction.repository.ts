import { Injectable } from '@nestjs/common';
import { PaginationResponse, RequestParams } from '@repo/types';
import { count, like } from 'drizzle-orm';
import { InjectDb } from 'src/db/db.provider';
import type { DB } from 'src/db/db.provider';
import { transactionTable } from 'src/db/schema';

@Injectable()
export class TransactionRepository {
  constructor(@InjectDb() private db: DB) {}

  async FindAllTransaction(req: RequestParams) {
    const searchCondition = req.search
      ? like(transactionTable.destination, `%${req.search}%`)
      : undefined;

    const [data, totalCount] = await Promise.all([
      this.db
        .select({
          id: transactionTable.id,
          invoice_number: transactionTable.invoice_number,
          status: transactionTable.status,
          product_code: transactionTable.product_code,
          destination: transactionTable.destination,
          price: transactionTable.price,
          amount: transactionTable.amount,
          discount: transactionTable.discount_price,
          total: transactionTable.total,
          payment_method: transactionTable.payment_method,
          created_at: transactionTable.created_at,
          customer_email: transactionTable.customer_email,
          customer_phone: transactionTable.customer_phone,
        })
        .from(transactionTable)
        .where(searchCondition)
        .limit(req.limit)
        .offset(req.offset),

      this.db
        .select({ count: count() })
        .from(transactionTable)
        .where(searchCondition)
        .then((result) => result[0].count),
    ]);

    const currentPage = Math.floor(req.offset / req.limit) + 1;
    const totalPages = Math.ceil(totalCount / req.limit);

    return {
      data,
      meta: {
        currentPage,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: req.limit,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      } as PaginationResponse,
    };
  }
}
