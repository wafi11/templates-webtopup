import z from "zod";
import { validationMinAndMaxValue } from "./validation";

export type Categories = {
  id: number;
  name: string;
  icon: string | null;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
};

export type CategoriesTable = {
  id: number;
  name: string;
  icon: string | null;
  is_active: boolean;
  order: number;
  created_at: Date;
  updated_at: Date;
};

export const validationCategories = z.object({
  name: validationMinAndMaxValue(5, "categories name", 150),
  icon: validationMinAndMaxValue(0, "categories name", 500),
  is_active: z.boolean(),
  order: z.number(),
});

export class CategoryRequest {
  name!: string;
  icon!: string;
  is_active!: boolean;
  order!: number;
}

export type CategoriesRequest = z.infer<typeof validationCategories>;

export const validationProductRequest = z.object({
  name: validationMinAndMaxValue(8, "Product Name", 100),
  subName: validationMinAndMaxValue(8, "Product Sub Name", 100),
  slug: validationMinAndMaxValue(8, "Product Slug", 100),
  categoryId: z.number(),
  description: validationMinAndMaxValue(0, "Product Description", 100),
  thumbnail: validationMinAndMaxValue(0, "Product Thumbnail", 500),
  bannerImage: validationMinAndMaxValue(0, "Product Banner Image", 500),
  code: validationMinAndMaxValue(2, "Product Code", 10),
  isActive: z.boolean(),
  order: z.number(),
});

export type ProductRequest = z.infer<typeof validationProductRequest>;

export type Product = {
  id: number;
  name: string;
  is_active: boolean;
  order: number;
  updated_at: string;
  sub_name: string | null;
  slug: string;
  code: string | null;
  category_id: number;
  description: string | null;
  thumbnail: string | null;
  created_at: string;
  banner_image: string | null;
};

export const validationSubProducts = z.object({
  name: validationMinAndMaxValue(4, "Sub Products Name", 100),
  code: validationMinAndMaxValue(4, "Sub Products Code", 50),
  icon: validationMinAndMaxValue(4, "SUb Products Icon", 200),
  productId: z.number(),
  isActive: z.boolean(),
  order: z.number(),
});

export type SubProductRequest = z.infer<typeof validationSubProducts>;

export type SubProduct = {
  id: number;
  created_at: string;
  name: string;
  icon: string | null;
  is_active: boolean;
  order: number;
  updated_at: string;
  code: string | null;
  product_id: number;
};

export const validationProductItems = z.object({
  name: validationMinAndMaxValue(8, "Product Items Name", 100),
  code: validationMinAndMaxValue(8, "Product Items Code", 50),
  subProductId: z.number(),
  isActive: z.boolean(),
  basePrice: z.number(),
  discountPrice: z.number().nullable(),
  stock: z.number().nullable(),
  isBestSeller: z.boolean(),
  order: z.number(),
});

export type ProductItemsRequest = z.infer<typeof validationProductItems>;

export type ProductItems = {
  id: number;
  created_at: string;
  name: string;
  is_active: boolean;
  order: number;
  updated_at: string;
  code: string | null;
  sub_product_id: number;
  base_price: number;
  discount_price: number | null;
  stock: number;
  is_best_seller: boolean;
};

export const validationFormFields = z.object({
  label: validationMinAndMaxValue(5, "Form Fields Label", 50),
  value: validationMinAndMaxValue(5, "Form Fields Value", 50),
  type: validationMinAndMaxValue(3, "Form Fields Type", 20),
  valuesOption: z.string().nullable(),
  order: z.number(),
  productId: z.number(),
});

export type RequestFormField = z.infer<typeof validationFormFields>;

export type FormFields = {
  id: number;
  order: number | null;
  product_id: number;
  label: string;
  value: string;
  type: string;
  values_option: string | null;
};
