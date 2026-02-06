import { api } from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { RequestParams, SubProduct, SubProductRequest } from "@repo/types";

export type FindSubProductsRequest = RequestParams & {
  id: string;
};
export async function CreateSubProduct(
  req: SubProductRequest,
): Promise<ApiResponse<SubProduct>> {
  const request = await api.post<ApiResponse<SubProduct>>("/sub-product", req);
  return request.data;
}

export async function FindSubProducts(
  params: FindSubProductsRequest,
): Promise<ApiResponse<SubProduct[]>> {
  const url = new URLSearchParams();
  url.append("limit", params.limit.toString());
  url.append("offset", params.offset.toString());
  url.append("product_id", params.id.toString());

  if (params.search) {
    url.append("search", params.search);
  }
  const request = await api.get<ApiResponse<SubProduct[]>>(
    `/sub-product?${url.toString()}`,
  );
  return request.data;
}

export async function UpdateSubProduct(
  req: SubProduct,
): Promise<ApiResponse<SubProduct>> {
  const dataRequest: SubProductRequest = {
    name: req.name,
    order: req.order,
    productId: req.product_id,
    code: req.code as string,
    icon: req.icon as string,
    isActive: req.is_active,
  };
  const request = await api.put<ApiResponse<SubProduct>>(
    `/sub-product/${req.id}`,
    dataRequest,
  );
  return request.data;
}

export async function DeleteSubProduct(
  id: number,
): Promise<ApiResponse<string>> {
  const request = await api.delete<ApiResponse<string>>(`/sub-product/${id}`);
  return request.data;
}
