import { DashboardHeader } from "@/components/layouts/DashboardHeader";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useDashboardProducts } from "../../hooks/useDashboardProducts";
import { ProductsTable } from "../../components/ProductsTable";

export default function ProductDashboard() {
  const {
    data,
    isLoading,
    deletePending,
    deleteMutate,
    updateMutate,
    updatePending,
  } = useDashboardProducts();
  return (
    <DashboardLayout>
      <DashboardHeader title="Manage Products" />
      <ProductsTable
        data={data}
        isLoading={isLoading}
        deletedPending={deletePending}
        onDelete={deleteMutate}
        onSave={updateMutate}
        savePending={updatePending}
      />
    </DashboardLayout>
  );
}
