import { index } from 'drizzle-orm/pg-core';
import {
  integer,
  pgTable,
  varchar,
  timestamp,
  text,
  boolean,
} from 'drizzle-orm/pg-core';

export const usersTable = pgTable(
  'users',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    fullname: varchar({ length: 255 }).notNull(),
    username: varchar({ length: 255 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    email_verified: boolean().default(false),
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
