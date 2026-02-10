import { createCrudEndpoints, createCrudHooks } from "@/lib/crud-factory";
import { FormFields, RequestFormField } from "@repo/types";

const formEndpoint = createCrudEndpoints<FormFields, RequestFormField>(
  "form-fields",
);
const formFieldsHooks = createCrudHooks<FormFields, RequestFormField>(
  "form-fields",
  formEndpoint,
);

// Export semua
export const {
  useCreate: useCreateFormFields,
  useFindAll: useFindAllFormFields,
  useFindOne: useFindOneFormFields,
  useUpdate: useUpdateFormFields,
  useDelete: useDeleteFormFields,
} = formFieldsHooks;
