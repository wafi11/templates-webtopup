import { pgTable, integer, varchar, text, index } from 'drizzle-orm/pg-core';
import { productsTable } from './products';

export const formFieldsTable = pgTable(
  'form_fields',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    label: varchar({ length: 50 }).notNull(),
    value: varchar({ length: 50 }).notNull(),
    type: varchar({ length: 20 }).notNull(),
    values_option: text(),
    order: integer(),
    product_id: integer()
      .references(() => productsTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  (table) => ({
    productIdIdx: index('form_fields_product_id_idx').on(table.product_id),
    productIdOrderIdx: index('form_fields_product_id_order_idx').on(
      table.product_id,
      table.order,
    ),
  }),
);
