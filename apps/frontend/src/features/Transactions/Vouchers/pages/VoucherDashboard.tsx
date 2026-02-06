import { DashboardHeader } from "@/components/layouts/DashboardHeader";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { VoucherTable } from "../components/VoucherTable";
import { useDeleteVoucher, useFindAllVoucher } from "../api/VoucherApi";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function VoucherDashboard() {
  const { data, isLoading } = useFindAllVoucher({
    limit: 10,
    offset: 0,
    search: null,
  });
  const deleted = useDeleteVoucher();
  const { push } = useRouter();
  return (
    <DashboardLayout>
      <DashboardHeader title="Manage Voucher">
        <Button onClick={() => push("/dashboard/transactions/vouchers/create")}>
          Create
        </Button>
      </DashboardHeader>
      <VoucherTable
        isLoading={isLoading}
        vouchers={data?.data ?? []}
        onDelete={deleted.mutate}
      />
    </DashboardLayout>
  );
}
