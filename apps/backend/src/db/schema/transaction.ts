import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { productsTable } from './products';

export const transactionTable = pgTable('transaction', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  product_code: varchar({ length: 10 })
    .notNull()
    .references(() => productsTable.code),
  payment_at: timestamp(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});
