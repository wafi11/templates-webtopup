import { DashboardHeader } from "@/components/layouts/DashboardHeader";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { ProductsItemTable } from "../../components/ProductItemTable";
import { useDashboardProductItems } from "../../hooks/useDashboardProductItems";

export default function ProductItemsDashboard() {
  const { data, updateMutate, updatePending, deleteMutate, deletePending } =
    useDashboardProductItems();
  return (
    <DashboardLayout>
      <DashboardHeader title="Product Items" />
      <ProductsItemTable
        data={data}
        deletedPending={deletePending}
        onDelete={deleteMutate}
        onSave={updateMutate}
        savePending={updatePending}
      />
    </DashboardLayout>
  );
}
