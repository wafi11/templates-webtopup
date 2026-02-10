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
  const [open, setOpen] = useState<boolean>(false);
  const [selectProduct, setSelectProduct] = useState<{
    id: number;
    name: string;
  } | null>({
    id: 1,
    name: "",
  });
  const { mutate: updateMutate, isPending: updatePending } =
    useUpdateSubProduct();
  const { mutate: deleteMutate, isPending: deletePending } =
    useDeleteSubProduct();
  const handleProductSelect = (product: { id: number; name: string }) => {
    setSelectProduct(product);
  };
  const clearProductFilter = () => {
    setSelectProduct(null);
  };

  const { data, isLoading, error } = useFindSubProducts({
    limit,
    offset,
    search,
    id: selectProduct?.id.toString() ?? "0",
  });

  return {
    updateMutate,
    deleteMutate,
    updatePending,
    deletePending,
    limit,
    offset,
    open,
    setOpen,
    isLoading,
    data: data?.data ?? [],
    error,
    setLimit,
    setOffSet,
    mutate,
    handleProductSelect,
    selectProduct,
    clearProductFilter,
    isPending,
  };
}
