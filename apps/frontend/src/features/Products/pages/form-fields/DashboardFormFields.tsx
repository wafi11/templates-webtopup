import { DashboardHeader } from "@/components/layouts/DashboardHeader";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { TableFilters } from "@/components/layouts/TableFilters";
import { Button } from "@/components/ui/button";
import { DialogFormFields } from "../../components/DialogFormFields";
import { FormFieldsTable } from "../../components/FormFieldsTable";
import { useDashboardFormFields } from "../../hooks/useDashboardFormFields";

export default function DashboardFormFields() {
  const {
    formFieldsData,
    handleDelete,
    handleUpdate,
    openDialog,
    pendingId,
    setLimit,
    setOpenDialog,
    limit,
    search,
    setSearch,
  } = useDashboardFormFields();

  return (
    <>
      <DashboardLayout>
        <DashboardHeader title="Manage Form Fields Products">
          <div className="flex justify-center gap-3">
            <TableFilters
              limit={limit}
              onLimitChange={setLimit}
              search={search ?? ""}
              searchPlaceholder="Search Form Fields"
              onSearchChange={setSearch}
            />
            <Button onClick={() => setOpenDialog(!openDialog)}>Create</Button>
          </div>
        </DashboardHeader>
        <FormFieldsTable
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          formFields={formFieldsData}
          pendingId={pendingId}
        />
      </DashboardLayout>
      {openDialog && (
        <DialogFormFields
          open={openDialog}
          setOpen={() => setOpenDialog(false)}
        />
      )}
    </>
  );
}
