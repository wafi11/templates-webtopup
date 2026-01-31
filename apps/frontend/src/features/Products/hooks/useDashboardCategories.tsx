import { useState } from "react";
import {
  useCreateCategory,
  useDeleteCategory,
  useFindCategories,
  useUpdateCategory,
} from "../api/CategoryApi";

export function useDashboardCategories() {
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffSet] = useState<number>(0);
  const [search, setSearch] = useState<string | null>(null);

  const { mutate, isPending } = useCreateCategory();
  const { mutate: updateMutate, isPending: updatePending } =
    useUpdateCategory();
  const { mutate: deleteMutate, isPending: deletePending } =
    useDeleteCategory();

  const { data, isLoading, error } = useFindCategories({
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
