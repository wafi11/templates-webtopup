import {
  integer,
  bigint,
  pgTable,
  varchar,
  timestamp,
  text,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { productItemsTable, productsTable } from './products';
import { usersTable } from './users';

export const transactionTable = pgTable(
  'transactions',
  {
    // Primary Key
    id: integer().primaryKey().generatedAlwaysAsIdentity(),

    // Relations
    user_id: integer()
      .notNull()
      .references(() => usersTable.id, { onDelete: 'restrict' }),
    product_code: varchar({ length: 20 })
      .notNull()
      .references(() => productItemsTable.code, { onDelete: 'restrict' }),
    provider_id: integer().notNull(),

    // Transaction References
    reference_id: varchar({ length: 50 }).notNull().unique(),
    invoice_number: varchar({ length: 50 }).unique(),
    external_id: varchar({ length: 100 }),
    status: varchar({ length: 20 }).notNull().default('pending'),
    payment_method: varchar({ length: 30 }).notNull(),
    payment_code: varchar({ length: 50 }).notNull(),
    payment_url: text(),

    // Pricing
    price: bigint({ mode: 'number' }).notNull(), // base price
    quantity: integer().notNull().default(1),
    amount: bigint({ mode: 'number' }).notNull(), // base price * quantity
    discount_price: bigint({ mode: 'number' }).notNull().default(0),
    voucher_code: varchar({ length: 50 }),
    fee: bigint({ mode: 'number' }).notNull().default(0),
    tax: bigint({ mode: 'number' }).notNull().default(0),
    total: bigint({ mode: 'number' }).notNull(),

    // Additional Info
    customer_email: varchar({ length: 100 }),
    customer_phone: varchar({ length: 20 }),

    // Product/Service Delivery
    destination: varchar({ length: 50 }), // nomor HP/email/account tujuan untuk digital product
    serial_number: varchar({ length: 100 }), // untuk voucher/serial number

    // Logs & Metadata
    log_request: text(), // request ke provider
    log_response: text(), // response dari provider
    log_callback: text(), // callback dari payment gateway
    error_message: text(),
    metadata: text(), // JSON string untuk data tambahan

    // Audit Trail
    ip_address: varchar({ length: 45 }),
    user_agent: text(),

    // Timestamps
    payment_at: timestamp(),
    expired_at: timestamp(),
    completed_at: timestamp(),
    cancelled_at: timestamp(),
    refunded_at: timestamp(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    // Primary Indexes - Query paling sering
    userIdIdx: index('transaction_user_id_idx').on(table.user_id),
    statusIdx: index('transaction_status_idx').on(table.status),
    referenceIdIdx: uniqueIndex('transaction_reference_id_idx').on(
      table.reference_id,
    ),

    // Composite Indexes - Query kombinasi yang sering
    userStatusIdx: index('transaction_user_status_idx').on(
      table.user_id,
      table.status,
    ),
    // Payment Related Indexes
    paymentCodeIdx: index('transaction_payment_code_idx').on(
      table.payment_code,
    ),
    paymentMethodIdx: index('transaction_payment_method_idx').on(
      table.payment_method,
    ),
    externalIdIdx: index('transaction_external_id_idx').on(table.external_id),
    invoiceNumberIdx: uniqueIndex('transaction_invoice_number_idx').on(
      table.invoice_number,
    ),

    // Product & Provider Indexes
    productCodeIdx: index('transaction_product_code_idx').on(
      table.product_code,
    ),
    providerIdIdx: index('transaction_provider_id_idx').on(table.provider_id),
    // Time-based Indexes
    createdAtIdx: index('transaction_created_at_idx').on(table.created_at),
    expiredAtIdx: index('transaction_expired_at_idx').on(table.expired_at),
    paymentAtIdx: index('transaction_payment_at_idx').on(table.payment_at),

    // Customer Related Indexes (opsional, tergantung use case)
    customerPhoneIdx: index('transaction_customer_phone_idx').on(
      table.customer_phone,
    ),

    // Voucher Index
    voucherCodeIdx: index('transaction_voucher_code_idx').on(
      table.voucher_code,
    ),
  }),
);

// Type exports untuk TypeScript
export type Transaction = typeof transactionTable.$inferSelect;
export type NewTransaction = typeof transactionTable.$inferInsert;
