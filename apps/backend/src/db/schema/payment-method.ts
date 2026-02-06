import {
  decimal,
  integer,
  bigint,
  pgTable,
  text,
  timestamp,
  varchar,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const paymentMethodTable = pgTable(
  'payment_methods',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 100 }).notNull(),
    description: varchar({ length: 100 }),
    code: varchar({ length: 10 }).notNull(),
    image: text(),
    min_amount: integer(),
    max_amount: bigint({ mode: 'number' }),
    margin_percentage: decimal({ precision: 10, scale: 2 })
      .notNull()
      .default('0'),
    margin_amount: integer().notNull().default(0),
    calculation_type: varchar({ length: 20 }),
    method: varchar({ length: 20 }),
    created_at: timestamp().defaultNow(),
    update_at: timestamp(),
  },
  (table) => ({
    codeIdx: uniqueIndex('payment_method_code_idx').on(table.code),
    nameIdx: index('payment_method_name_idx').on(table.name),
  }),
);
