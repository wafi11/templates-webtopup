import { useState } from "react";
import {
  useCreateProduct,
  useDeleteProduct,
  useFindProducts,
  useUpdateProduct,
} from "../api/ProductApi";

export function useDashboardProducts() {
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffSet] = useState<number>(0);
  const [search, setSearch] = useState<string | null>(null);
  const { mutate, isPending } = useCreateProduct();
  const { mutate: updateMutate, isPending: updatePending } = useUpdateProduct();
  const { mutate: deleteMutate, isPending: deletePending } = useDeleteProduct();

  const { data, isLoading, error } = useFindProducts({
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
