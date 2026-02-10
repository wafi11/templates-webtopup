import { DashboardHeader } from "@/components/layouts/DashboardHeader";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { SubProductTable } from "../../components/SubProductTable";
import { useDashboardSubProducts } from "../../hooks/useDashbaordSubProduct";
import { TableFilters } from "@/components/layouts/TableFilters";
import { ProductFilter } from "../../components/ProductFilter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

export default function SubProductDashboard() {
  const {
    data,
    deleteMutate,
    deletePending,
    isLoading,
    updateMutate,
    limit,
    setLimit,
    open,
    setOpen,
    selectProduct,
    handleProductSelect,
    clearProductFilter,
  } = useDashboardSubProducts();

  return (
    <DashboardLayout>
      <DashboardHeader title="Manage Sub Product">
        <div className="flex justify-center items-center gap-2">
          {/* Product Filter with Badge */}
          <div className="flex items-center gap-2">
            <ProductFilter
              onSelect={handleProductSelect}
              open={open}
              setOpen={setOpen}
              value={selectProduct?.id}
            >
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {selectProduct?.name ? "Change Product" : "Filter by Product"}
              </Button>
            </ProductFilter>

            {selectProduct?.name && (
              <Badge variant="secondary" className="gap-1 pr-1">
                {selectProduct.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={clearProductFilter}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
          <TableFilters
            limit={limit}
            onLimitChange={setLimit}
            withSearch={false}
          />
        </div>
      </DashboardHeader>
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
