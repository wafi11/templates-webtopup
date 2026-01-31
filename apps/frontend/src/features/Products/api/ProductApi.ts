import { Product, ProductRequest, RequestParams } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CreateProducts,
  DeleteProduct,
  FindProducts,
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

export function useFindProducts(params: RequestParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => FindProducts(params),
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
