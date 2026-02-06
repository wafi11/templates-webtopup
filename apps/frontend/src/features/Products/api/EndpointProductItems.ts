import { api } from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { ProductItems, ProductItemsRequest, RequestParams } from "@repo/types";

export async function CreateProductItem(
  req: ProductItemsRequest,
): Promise<ApiResponse<ProductItems>> {
  const request = await api.post<ApiResponse<ProductItems>>(
    "/product-item",
    req,
  );
  return request.data;
}

export async function FindProductItem(
  params: RequestParams,
): Promise<ApiResponse<ProductItems[]>> {
  const url = new URLSearchParams();
  url.append("limit", params.limit.toString());
  url.append("offset", params.offset.toString());
  if (params.search) {
    url.append("search", params.search);
  }
  const request = await api.get<ApiResponse<ProductItems[]>>(
    `/product-item?${url.toString()}`,
  );
  return request.data;
}

export async function FindProductItemOrder(
  product: number,
  sub: number,
): Promise<ApiResponse<ProductItems[]>> {
  const url = new URLSearchParams();
  url.append("product", product.toString());
  url.append("sub-product", sub.toString());
  const request = await api.get<ApiResponse<ProductItems[]>>(
    `/product-item/order?${url.toString()}`,
  );
  return request.data;
}

export async function UpdateProductItem(
  req: ProductItems,
): Promise<ApiResponse<ProductItems>> {
  const dataRequest: ProductItemsRequest = {
    basePrice: req.base_price,
    code: req.code as string,
    discountPrice: req.discount_price,
    isActive: req.is_active,
    isBestSeller: req.is_best_seller,
    name: req.name,
    order: req.order,
    stock: req.stock,
    subProductId: req.sub_product_id,
  };
  const request = await api.put<ApiResponse<ProductItems>>(
    `/product-item/${req.id}`,
    dataRequest,
  );
  return request.data;
}

export async function DeleteProductItem(
  id: number,
): Promise<ApiResponse<string>> {
  const request = await api.delete<ApiResponse<string>>(`/product-item/${id}`);
  return request.data;
}
