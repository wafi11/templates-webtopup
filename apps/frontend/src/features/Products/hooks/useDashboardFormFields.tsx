import { useState } from "react";
import {
  useDeleteFormFields,
  useFindAllFormFields,
  useUpdateFormFields,
} from "../api/FormFieldsApi";
import { useDebounce } from "@/hooks/useDebounce";
import { FormFields } from "@repo/types";

export function useDashboardFormFields() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [pendingId, setPendingId] = useState<number | undefined>();
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string | null>("");
  const { mutate: updateMutate } = useUpdateFormFields();
  const { mutate: deleteMutate } = useDeleteFormFields();

  const debounceSearch = useDebounce(search, 600);

  const { data } = useFindAllFormFields({
    limit,
    offset: 0,
    search: debounceSearch,
  });
  const formFieldsData = data?.data ?? [];

  const handleUpdate = (formFields: FormFields) => {
    setPendingId(formFields.id);
    updateMutate(
      {
        data: {
          label: formFields.label,
          order: formFields.order as number,
          type: formFields.type,
          value: formFields.value,
          valuesOption: formFields.values_option,
          productId: formFields.product_id,
        },
        id: formFields.id,
      },
      {
        onSettled: () => setPendingId(undefined),
      },
    );
  };

  const handleDelete = (id: number) => {
    setPendingId(id);
    deleteMutate(id, {
      onSettled: () => setPendingId(undefined),
    });
  };

  return {
    limit,
    search,
    handleDelete,
    handleUpdate,
    formFieldsData,
    openDialog,
    setOpenDialog,
    deleteMutate,
    pendingId,
    setPendingId,
    setLimit,
    setSearch,
  };
}
