import { Voucher, RequestVoucher } from "@repo/types";
import { createCrudEndpoints, createCrudHooks } from "@/lib/crud-factory";

const voucherEndpoints = createCrudEndpoints<Voucher, RequestVoucher>(
  "voucher",
);
const voucherHooks = createCrudHooks<Voucher, RequestVoucher>(
  "voucher",
  voucherEndpoints,
);

// Export semua
export const {
  useCreate: useCreateVoucher,
  useFindAll: useFindAllVoucher,
  useFindOne: useFindOneVoucher,
  useUpdate: useUpdateVoucher,
  useDelete: useDeleteVoucher,
} = voucherHooks;
