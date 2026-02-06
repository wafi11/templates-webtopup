import { api } from "@/lib/api";
import { ApiPagination } from "@/lib/types";
import { RequestParams } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { User } from "./types";

export async function FindAllUsers(
  req: RequestParams,
): Promise<ApiPagination<User[]>> {
  const url = new URLSearchParams();
  url.append("limit", req.limit.toString());
  url.append("offset", req.offset.toString());
  if (req.search) {
    url.append("search", req.search.toString());
  }
  const request = await api.get<ApiPagination<User[]>>(`/user?${url}`);
  return request.data;
}

export function useFindAllUsers(req: RequestParams) {
  return useQuery({
    queryKey: ["users-all", req],
    queryFn: () => FindAllUsers(req),
  });
}
