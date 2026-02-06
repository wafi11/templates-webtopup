import { api } from "@/lib/api";
import { ApiResponse } from "@/lib/types";
import {
  PaymentMethod,
  RequestParams,
  RequestValidationPaymentMethod,
} from "@repo/types";

export async function CreatePaymentMethod(
  req: RequestValidationPaymentMethod,
): Promise<ApiResponse<PaymentMethod>> {
  const data = await api.post<ApiResponse<PaymentMethod>>(
    "/payment-method",
    req,
  );
  return data.data;
}

export async function FindAllPaymentMethod(
  params: RequestParams,
): Promise<ApiResponse<PaymentMethod[]>> {
  const url = new URLSearchParams();
  url.append("limit", params.limit.toString());
  url.append("offset", params.offset.toString());
  if (params.search) {
    url.append("search", params.search);
  }
  const data = await api.get<ApiResponse<PaymentMethod[]>>(
    `/payment-method?${url.toString()}`,
  );
  return data.data;
}

export async function UpdatePaymentMethod(
  req: PaymentMethod,
  id: number,
): Promise<ApiResponse<PaymentMethod>> {
  const request = await api.put<ApiResponse<PaymentMethod>>(
    `/payment-method/${id}`,
    req,
  );
  return request.data;
}

export async function DeletePaymentMethod(
  id: number,
): Promise<ApiResponse<string>> {
  const request = await api.delete<ApiResponse<string>>(
    `/payment-method/${id}`,
  );
  return request.data;
}
