import { useState } from "react";
import {
  useCreateProduct,
  useDeleteProduct,
  useFindProducts,
  useUpdateProduct,
} from "../api/ProductApi";
import {
  useCreateSubProduct,
  useDeleteSubProduct,
  useFindSubProducts,
  useUpdateSubProduct,
} from "../api/SubProductApi";

export function useDashboardSubProducts() {
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffSet] = useState<number>(0);
  const [search, setSearch] = useState<string | null>(null);
  const { mutate, isPending } = useCreateSubProduct();
  const { mutate: updateMutate, isPending: updatePending } =
    useUpdateSubProduct();
  const { mutate: deleteMutate, isPending: deletePending } =
    useDeleteSubProduct();

  const { data, isLoading, error } = useFindSubProducts({
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
