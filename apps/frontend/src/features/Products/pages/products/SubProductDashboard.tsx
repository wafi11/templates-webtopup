import { DashboardHeader } from "@/components/layouts/DashboardHeader";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { SubProductTable } from "../../components/SubProductTable";
import { useDashboardSubProducts } from "../../hooks/useDashbaordSubProduct";

export default function SubProductDashboard() {
  const {
    data,
    deleteMutate,
    deletePending,
    isLoading,
    updateMutate,
    updatePending,
  } = useDashboardSubProducts();
  return (
    <DashboardLayout>
      <DashboardHeader title="Manage Sub Product" />
      <SubProductTable
        data={data}
        onDelete={deleteMutate}
        onUpdate={updateMutate}
        deletePending={deletePending}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
}
