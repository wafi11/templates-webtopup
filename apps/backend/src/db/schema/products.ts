import { relations } from 'drizzle-orm';
import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  bigint,
  boolean,
  index,
  decimal,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { rolesTable } from './users';

// ============================================
// CATEGORIES
// ============================================
export const categoriesTable = pgTable(
  'categories',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 200 }).notNull(),
    icon: text(),
    is_active: boolean().default(true).notNull(),
    order: integer().default(0).notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    activeOrderIdx: index('categories_active_order_idx').on(
      table.is_active,
      table.order,
    ),
  }),
);

// ============================================
// PRODUCTS
// ============================================
export const productsTable = pgTable(
  'products',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 200 }).notNull(),
    sub_name: varchar({ length: 200 }),
    slug: varchar({ length: 200 }).notNull(),
    code: varchar({ length: 10 }).unique(),
    category_id: integer()
      .references(() => categoriesTable.id, { onDelete: 'cascade' })
      .notNull(),
    description: text(),
    thumbnail: text(),
    banner_image: text(),
    code_check_nickname: varchar({ length: 10 }),
    is_active: boolean().default(true).notNull(),
    order: integer().default(0).notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex('products_slug_idx').on(table.slug),
    codeIdx: uniqueIndex('products_code_idx').on(table.code),
    categoryIdx: index('products_category_id_idx').on(table.category_id),
    categoryActiveOrderIdx: index('products_category_active_order_idx').on(
      table.category_id,
      table.is_active,
      table.order,
    ),
    nameIdx: index('products_name_idx').on(table.name),
  }),
);

// ============================================
// SUB PRODUCTS
// ============================================
export const subProductsTable = pgTable(
  'sub_products',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 100 }).notNull(),
    code: varchar({ length: 50 }),
    icon: text(),

    product_id: integer()
      .references(() => productsTable.id, { onDelete: 'cascade' })
      .notNull(),

    is_active: boolean().default(true).notNull(),
    order: integer().default(0).notNull(),

    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    productIdx: index('sub_products_product_id_idx').on(table.product_id),
    productActiveOrderIdx: index('sub_products_product_active_order_idx').on(
      table.product_id,
      table.is_active,
      table.order,
    ),
    codeIdx: index('sub_products_code_idx').on(table.code),
  }),
);

// ============================================
// PRODUCT ITEMS
// ============================================
export const productItemsTable = pgTable(
  'product_items',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 200 }).notNull(),
    code: varchar({ length: 50 }).unique(),
    sub_product_id: integer()
      .references(() => subProductsTable.id, { onDelete: 'cascade' })
      .notNull(),
    product_id: integer().references(() => productsTable.id, {
      onDelete: 'cascade',
    }),
    base_price: bigint({ mode: 'number' }).notNull(),
    discount_price: bigint({ mode: 'number' }),
    stock: integer().default(999999).notNull(),
    is_active: boolean().default(true).notNull(),
    is_best_seller: boolean().default(false).notNull(),
    order: integer().default(0).notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    codeIdx: uniqueIndex('product_items_code_idx').on(table.code),
    subProductIdx: index('product_items_sub_product_id_idx').on(
      table.sub_product_id,
    ),
    subProductActiveOrderIdx: index(
      'product_items_sub_product_active_order_idx',
    ).on(table.sub_product_id, table.is_active, table.order),
    bestSellerIdx: index('product_items_best_seller_idx').on(
      table.is_best_seller,
      table.is_active,
    ),
    stockIdx: index('product_items_stock_idx').on(table.stock, table.is_active),
    productIdx: index('product_items_product_id_idx').on(table.product_id),
    productActiveOrderIdx: index('product_items_product_active_order_idx').on(
      table.product_id,
      table.is_active,
      table.order,
    ),
  }),
);
export const productItemsRoles = pgTable(
  'product_items_roles',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    product_items_id: integer().references(() => productItemsTable.id),
    roles_id: integer().references(() => rolesTable.id),
    margin_amount: integer().notNull().default(0),
    margin_percentage: decimal({ precision: 10, scale: 2 })
      .notNull()
      .default('0'),
    calculation_type: varchar({ length: 20 }).notNull().default('HYBRID'),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    productItemRoleUniqueIdx: uniqueIndex(
      'product_items_roles_composite_unique_idx',
    ).on(table.product_items_id, table.roles_id),
    productItemIdx: index('product_items_roles_product_item_idx').on(
      table.product_items_id,
    ),
    roleIdx: index('product_items_roles_role_idx').on(table.roles_id),
  }),
);
// ============================================
// RELATIONS
// ============================================
export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  products: many(productsTable),
}));

export const productsRelations = relations(productsTable, ({ one, many }) => ({
  category: one(categoriesTable, {
    fields: [productsTable.category_id],
    references: [categoriesTable.id],
  }),
  subProducts: many(subProductsTable),
}));

export const subProductsRelations = relations(
  subProductsTable,
  ({ one, many }) => ({
    product: one(productsTable, {
      fields: [subProductsTable.product_id],
      references: [productsTable.id],
    }),
    items: many(productItemsTable),
  }),
);

export const productItemsRelations = relations(
  productItemsTable,
  ({ one }) => ({
    subProduct: one(subProductsTable, {
      fields: [productItemsTable.sub_product_id],
      references: [subProductsTable.id],
    }),
  }),
);
