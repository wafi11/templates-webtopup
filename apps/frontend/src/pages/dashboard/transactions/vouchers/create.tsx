import { DashboardHeader } from "@/components/layouts/DashboardHeader";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useCreateVoucher } from "@/features/Transactions/Vouchers/api/VoucherApi";
import { FormVoucher } from "@/features/Transactions/Vouchers/components/FormVoucher";

export default function CreateVoucher() {
  const { mutate, isPending } = useCreateVoucher();
  return (
    <DashboardLayout>
      <DashboardHeader title="Create Voucher" />
      <FormVoucher onSubmit={mutate} isLoading={isPending} />
    </DashboardLayout>
  );
}
