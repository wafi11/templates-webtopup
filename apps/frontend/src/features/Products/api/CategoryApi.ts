import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CreateCategory,
  DeleteCategory,
  FindCategories,
  FindCategoryBySlug,
  UpdateCategory,
} from "./EndpointCategoryApi";
import { Categories, CategoryRequest, RequestParams } from "@repo/types";
import { toast } from "sonner";

export function useCreateCategory() {
  return useMutation({
    mutationKey: ["category"],
    mutationFn: (req: CategoryRequest) => CreateCategory(req),
    onSuccess: () => {
      toast.success("Category Created Sucessfully");
    },
    onError: (ctx) => {
      toast.error(ctx.message);
    },
  });
}

export function useFindCategories(req: RequestParams) {
  return useQuery({
    queryKey: ["category", req],
    queryFn: () => FindCategories(req),
  });
}

export function useFindCategoryBySlug(req: string) {
  return useQuery({
    queryKey: ["category-slug", req],
    queryFn: () => FindCategoryBySlug(req),
  });
}

export function useUpdateCategory() {
  return useMutation({
    mutationKey: ["category-update"],
    mutationFn: (req: Categories) =>
      UpdateCategory(
        {
          icon: req.icon as string,
          is_active: req.is_active,
          name: req.name,
          order: req.order,
        },
        req.id,
      ),
    onSuccess: (ctx) => {
      toast.success(ctx.message);
    },
    onError: (ctx) => {
      toast.error(ctx.message);
    },
  });
}

export function useDeleteCategory() {
  return useMutation({
    mutationKey: ["category-delete"],
    mutationFn: (id: number) => DeleteCategory(id),
    onSuccess: (ctx) => {
      toast.success(ctx.message);
    },
    onError: (ctx) => {
      toast.error(ctx.message);
    },
  });
}
