import { SkeletonTable } from "@/components/ui/skeleton-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@repo/types";
import { ProductEditTable } from "./ProductEditTable";

interface ProductsTableProps {
  data: Product[];
  isLoading?: boolean;
  onSave: (item: Product) => void;
  onDelete: (id: number) => void;
  savePending: boolean;
  deletedPending: boolean;
}

export function ProductsTable({
  data,
  isLoading,
  deletedPending,
  onDelete,
  onSave,
  savePending,
}: ProductsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product Id</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Product SubName</TableHead>
          <TableHead>Product Code</TableHead>
          <TableHead>Product Slug</TableHead>
          <TableHead>Product Description</TableHead>
          <TableHead>Product Order</TableHead>
          <TableHead>Product Active</TableHead>
          <TableHead>Terbuat</TableHead>
          <TableHead>TerUpdate</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <SkeletonTable key={idx} idx={idx} />
          ))
        ) : data.length > 0 ? (
          data.map((item,idx) => (
            <ProductEditTable
            key={idx}
              item={item}
              deletedPending={deletedPending}
              onDelete={onDelete}
              onSave={onSave}
              savePending={savePending}
            />
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={11} className="text-center">
              No products found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
