import { Product, ProductRequest, RequestParams } from "@repo/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CreateProducts,
  DeleteProduct,
  FindProducts,
  FindSearchProducts,
  UpdateProducts,
} from "./EndpointProductApi";

export function useCreateProduct() {
  return useMutation({
    mutationKey: ["products"],
    mutationFn: (req: ProductRequest) => CreateProducts(req),
    onSuccess: (ctx) => {
      toast.success(ctx.message);
    },
    onError: (ctx) => {
      toast.error(ctx.message);
    },
  });
}
export function useSearchProducts(search: string, limit: number) {
  return useInfiniteQuery({
    queryKey: ["search-products", search, limit],
    queryFn: ({ pageParam }) =>
      FindSearchProducts({
        limit,
        search,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.data.nextCursor ?? undefined;
    },
    initialPageParam: undefined as number | undefined,
    enabled: search.length > 0,
  });
}
export function useFindProducts(params: RequestParams, category: number) {
  return useQuery({
    queryKey: ["products", params, category],
    queryFn: () => FindProducts(params, category.toString()),
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationKey: ["product-update"],
    mutationFn: (req: Product) => UpdateProducts(req),
  });
}

export function useDeleteProduct() {
  return useMutation({
    mutationKey: ["product-delete"],
    mutationFn: (id: number) => DeleteProduct(id),
  });
}
