import {
  pgTable,
  integer,
  varchar,
  decimal,
  index,
  uniqueIndex,
  boolean,
  timestamp,
  text,
} from 'drizzle-orm/pg-core';

export const voucherTable = pgTable(
  'vouchers',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 100 }).notNull(),
    code: varchar({ length: 10 }).notNull(),
    description: varchar({ length: 200 }),
    margin_percentage: decimal({ precision: 10, scale: 2 })
      .notNull()
      .default('0'),
    margin_amount: integer().notNull().default(0),
    calculation_type: varchar({ length: 20 }),
    only_product: boolean(),
    products: text(),

    // Field stock/kuota voucher
    max_usage: integer(), // Total maksimal penggunaan voucher (null = unlimited)
    current_usage: integer().notNull().default(0), // Jumlah voucher yang sudah digunakan
    max_usage_per_user: integer(), // Maksimal penggunaan per user (null = unlimited)

    started_at: timestamp().notNull(),
    end_at: timestamp().notNull(),
    created_at: timestamp().defaultNow(),
    update_at: timestamp(),
  },
  (table) => ({
    codeIdx: uniqueIndex('voucher_code_idx').on(table.code),
    dateRangeIdx: index('voucher_date_range_idx').on(
      table.started_at,
      table.end_at,
    ),
    activeVouchersIdx: index('voucher_active_idx').on(
      table.started_at,
      table.end_at,
      table.code,
    ),
    // Index untuk query voucher yang masih available
    usageIdx: index('voucher_usage_idx').on(
      table.current_usage,
      table.max_usage,
    ),
  }),
);
