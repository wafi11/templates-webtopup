import { useState } from "react";
import {
  useFindProductItem,
  useCreateProductItem,
  useDeleteProductItem,
  useUpdateProductItem,
} from "../api/ProductItemApi";

export function useDashboardProductItems() {
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffSet] = useState<number>(0);
  const [search, setSearch] = useState<string | null>(null);

  const { mutate, isPending } = useCreateProductItem();
  const { mutate: updateMutate, isPending: updatePending } =
    useUpdateProductItem();
  const { mutate: deleteMutate, isPending: deletePending } =
    useDeleteProductItem();

  const { data, isLoading, error } = useFindProductItem({
    limit,
    offset,
    search,
  });

  return {
    updateMutate,
    deleteMutate,
    updatePending,
    deletePending,
    limit,
    offset,
    isLoading,
    data: data?.data ?? [],
    error,
    setLimit,
    setOffSet,
    mutate,
    isPending,
  };
}
