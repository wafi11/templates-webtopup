import { api } from "@/lib/api";
import { ApiPagination } from "@/lib/types";
import { RequestParams } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { OrderInvoice } from "./types";

export async function findAllOrders(
  req: RequestParams,
): Promise<ApiPagination<OrderInvoice[]>> {
  const url = new URLSearchParams();
  url.append("limit", req.limit.toString());
  url.append("offset", req.offset.toString());

  if (req.search) {
    url.append("search", req.search);
  }

  const data = await api.get<ApiPagination<OrderInvoice[]>>(
    `/transaction?${url}`,
  );
  return data.data;
}

export function useFindAllOrder(req: RequestParams) {
  return useQuery({
    queryKey: ["orders", req],
    queryFn: () => findAllOrders(req),
  });
}
