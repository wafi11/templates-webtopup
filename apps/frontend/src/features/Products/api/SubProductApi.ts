import { RequestParams, SubProduct, SubProductRequest } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CreateSubProduct,
  DeleteSubProduct,
  FindSubProducts,
  UpdateSubProduct,
} from "./EndpointSubProductApi";

export function useCreateSubProduct() {
  return useMutation({
    mutationKey: ["sub-product"],
    mutationFn: (req: SubProductRequest) => CreateSubProduct(req),
    onSuccess: (ctx) => {
      toast.success(ctx.message);
    },
    onError: (ctx) => {
      toast.error(ctx.message);
    },
  });
}

export function useFindSubProducts(params: RequestParams) {
  return useQuery({
    queryKey: ["sub-product", params],
    queryFn: () => FindSubProducts(params),
  });
}

export function useUpdateSubProduct() {
  return useMutation({
    mutationKey: ["sub-product-update"],
    mutationFn: (req: SubProduct) => UpdateSubProduct(req),
  });
}

export function useDeleteSubProduct() {
  return useMutation({
    mutationKey: ["sub-product-delete"],
    mutationFn: (id: number) => DeleteSubProduct(id),
  });
}
