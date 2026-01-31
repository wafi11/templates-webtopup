import { DashboardHeader } from "@/components/layouts/DashboardHeader";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { CategoriesDialog } from "../../components/CategoriesDialog";
import { CategoriesTable } from "../../components/CategoriesTable";
import { useDashboardCategories } from "../../hooks/useDashboardCategories";

export default function CategoriesDashboard() {
  const {
    isPending,
    mutate,
    data,
    limit,
    offset,
    setLimit,
    setOffSet,
    updateMutate,
    updatePending,
    deleteMutate,
    deletePending,
  } = useDashboardCategories();
  return (
    <DashboardLayout>
      <DashboardHeader title="Manage Categories">
        <CategoriesDialog isPending={isPending} onSubmit={mutate} />
      </DashboardHeader>
      <CategoriesTable
        data={data}
        onDelete={deleteMutate}
        onUpdate={updateMutate}
        isLoading={updatePending}
      />
    </DashboardLayout>
  );
}
