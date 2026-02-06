import { api } from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { CategoriesRequest, Categories, RequestParams } from "@repo/types";

export async function CreateCategory(
  req: CategoriesRequest,
): Promise<ApiResponse<Categories>> {
  const request = await api.post<ApiResponse<Categories>>("/category", req);
  return request.data;
}

export async function FindCategories(
  req: RequestParams,
): Promise<ApiResponse<Categories[]>> {
  const url = new URLSearchParams();
  url.append("limit", req.limit.toString());
  url.append("offset", req.offset.toString());
  if (req.search) {
    url.append("search", req.search);
  }
  const request = await api.get<ApiResponse<Categories[]>>(
    `/category?${url.toString()}`,
  );
  return request.data;
}

export async function FindCategoryBySlug(
  slug: string,
): Promise<ApiResponse<Categories>> {
  const normalized = slug.toUpperCase().replaceAll(" ", "-");
  const request = await api.get<ApiResponse<Categories>>(
    `/category/${normalized}`,
  );
  return request.data;
}

export async function UpdateCategory(
  req: CategoriesRequest,
  id: number,
): Promise<ApiResponse<Categories>> {
  const request = await api.put<ApiResponse<Categories>>(
    `/category/${id}`,
    req,
  );
  return request.data;
}

export async function DeleteCategory(id: number): Promise<ApiResponse<string>> {
  const request = await api.delete<ApiResponse<string>>(`/category/${id}`);
  return request.data;
}
