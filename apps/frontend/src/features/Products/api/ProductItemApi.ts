import {
  Product,
  ProductItems,
  ProductItemsRequest,
  ProductRequest,
  RequestParams,
} from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CreateProductItem,
  DeleteProductItem,
  FindProductItem,
  FindProductItemOrder,
  UpdateProductItem,
} from "./EndpointProductItems";

export function useCreateProductItem() {
  return useMutation({
    mutationKey: ["products-item"],
    mutationFn: (req: ProductItemsRequest) => CreateProductItem(req),
    onSuccess: (ctx) => {
      toast.success(ctx.message);
    },
    onError: (ctx) => {
      toast.error(ctx.message);
    },
  });
}

export function useFindProductItem(params: RequestParams) {
  return useQuery({
    queryKey: ["product-items", params],
    queryFn: () => FindProductItem(params),
  });
}

export function useFindProductItemOrder({
  req,
}: {
  req: {
    product: number;
    sub_product: number;
  };
}) {
  return useQuery({
    queryKey: ["product-items-order", req],
    queryFn: () => FindProductItemOrder(req.product, req.sub_product),
  });
}

export function useUpdateProductItem() {
  return useMutation({
    mutationKey: ["product-item-update"],
    mutationFn: (req: ProductItems) => UpdateProductItem(req),
  });
}

export function useDeleteProductItem() {
  return useMutation({
    mutationKey: ["product-item-delete"],
    mutationFn: (id: number) => DeleteProductItem(id),
  });
}
