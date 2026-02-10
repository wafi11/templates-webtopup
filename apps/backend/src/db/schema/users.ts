import { bigint } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
import {
  integer,
  pgTable,
  varchar,
  timestamp,
  text,
  boolean,
} from 'drizzle-orm/pg-core';
import { transactionTable } from './transaction';

export const usersTable = pgTable(
  'users',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    fullname: varchar({ length: 255 }).notNull(),
    username: varchar({ length: 255 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    email_verified: boolean().default(false),
    balance: bigint({ mode: 'number' }).notNull().default(0),
    role_id : integer(),
    password_hash: text(),
    password: varchar({ length: 20 }),
    avatar_url: text(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
    usernameIdx: index('users_username_idx').on(table.username),
  }),
);

export const rolesTable = pgTable('roles', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
});

export const sessionsTable = pgTable(
  'sessions',
  {
    id: varchar({ length: 255 }).primaryKey(),
    access_token: varchar({ length: 500 }).notNull(),
    refresh_token: varchar({ length: 500 }).notNull(),
    user_id: integer()
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    ip_address: varchar({ length: 50 }),
    user_agent: text(),
    expires_at: timestamp().notNull(),
    created_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('sessions_user_id_idx').on(table.user_id),
    expiresAtIdx: index('sessions_expires_at_idx').on(table.expires_at),
  }),
);

export const accountsTable = pgTable(
  'accounts',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    user_id: integer()
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    provider: varchar({ length: 50 }).notNull(),
    provider_account_id: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull(),
    access_token: text(),
    refresh_token: text(),
    expires_at: timestamp(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('accounts_user_id_idx').on(table.user_id),
    providerIdx: index('accounts_provider_idx').on(
      table.provider,
      table.provider_account_id,
    ),
  }),
);

export const balance_logs = pgTable(
  'balance_logs',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    invoice_number: varchar({ length: 50 })
      .references(() => transactionTable.invoice_number)
      .notNull(),
    transaction_type: varchar({ length: 20 }),
    before_balance: bigint({ mode: 'number' }),
    after_balance: bigint({ mode: 'number' }),
    amount: bigint({ mode: 'number' }),
    user_id: integer().references(() => usersTable.id),
    created_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    // Index untuk query by user (filter logs per user)
    userIdIdx: index('balance_logs_user_id_idx').on(table.user_id),

    // Index untuk query by invoice (trace transaction)
    invoiceNumberIdx: index('balance_logs_invoice_number_idx').on(
      table.invoice_number,
    ),

    // Composite index untuk query by user + time range
    userCreatedIdx: index('balance_logs_user_created_idx').on(
      table.user_id,
      table.created_at.desc(),
    ),

    // Index untuk filter by transaction type
    transactionTypeIdx: index('balance_logs_transaction_type_idx').on(
      table.transaction_type,
    ),

    // Composite index untuk reporting (user + type + time)
    userTypeCreatedIdx: index('balance_logs_user_type_created_idx').on(
      table.user_id,
      table.transaction_type,
      table.created_at.desc(),
    ),
  }),
);
