import { api } from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import { RequestParams, RequestVoucher, Voucher } from "@repo/types";

export async function createVoucher(
  req: RequestVoucher,
): Promise<ApiResponse<Voucher>> {
  const request = await api.post<ApiResponse<Voucher>>("/voucher", req);
  return request.data;
}

export async function findAllVoucher(
  params: RequestParams,
): Promise<ApiResponse<Voucher[]>> {
  const url = new URLSearchParams();
  url.append("limit", params.limit.toString());
  url.append("offset", params.offset.toString());
  if (params.search) {
    url.append("search", params.search);
  }
  const request = await api.get<ApiResponse<Voucher[]>>(`/voucher?${url}`);
  return request.data;
}

export async function update(
  request: RequestVoucher,
  id: number,
): Promise<ApiResponse<Voucher>> {
  const req = await api.put<ApiResponse<Voucher>>(`/voucher/${id}`, request);
  return req.data;
}

export async function deleteVoucher(id: number): Promise<ApiResponse<Voucher>> {
  const req = await api.delete<ApiResponse<Voucher>>(`/voucher/${id}`);
  return req.data;
}
