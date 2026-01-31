import { Api, api } from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { Product, ProductRequest, RequestParams } from "@repo/types";

export async function CreateProducts(
  req: ProductRequest,
): Promise<ApiResponse<Product>> {
  const request = await api.post<ApiResponse<Product>>("/product", req);
  return request.data;
}

export async function FindProducts(
  params: RequestParams,
): Promise<ApiResponse<Product[]>> {
  const url = new URLSearchParams();
  url.append("limit", params.limit.toString());
  url.append("offset", params.offset.toString());
  if (params.search) {
    url.append("search", params.search);
  }
  const request = await api.get<ApiResponse<Product[]>>(
    `/product?${url.toString()}`,
  );
  return request.data;
}

export async function UpdateProducts(
  req: Product,
): Promise<ApiResponse<Product>> {
  const dataRequest: ProductRequest = {
    name: req.name,
    order: req.order,
    slug: req.slug,
    code: req.code as string,
    description: req.description as string,
    thumbnail: req.thumbnail as string,
    bannerImage: req.banner_image as string,
    categoryId: req.category_id,
    isActive: req.is_active,
    subName: req.sub_name as string,
  };
  const request = await api.put<ApiResponse<Product>>(
    `/product/${req.id}`,
    dataRequest,
  );
  return request.data;
}

export async function DeleteProduct(id: number): Promise<ApiResponse<string>> {
  const request = await api.delete<ApiResponse<string>>(`/product/${id}`);
  return request.data;
}
