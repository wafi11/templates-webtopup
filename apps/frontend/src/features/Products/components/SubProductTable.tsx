import { EmptyStateTable } from "@/components/ui/empty-state-table";
import { SkeletonTable } from "@/components/ui/skeleton-table";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SubProduct } from "@repo/types";
import { SubProductEditTable } from "./SubProductEditTable";

interface SubProductTableProps {
  data: SubProduct[];
  onDelete: (id: number) => void;
  onUpdate: (data: SubProduct) => void;
  isLoading?: boolean;
  savePending?: boolean;
  deletePending?: boolean;
}

export function SubProductTable({
  data,
  isLoading,
  onDelete,
  onUpdate,
  savePending = false,
  deletePending = false,
}: SubProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Sub Product Name</TableHead>
          <TableHead>Sub Product Code</TableHead>
          <TableHead>Sub Product Icon</TableHead>
          <TableHead>Sub Product Order</TableHead>
          <TableHead>Sub Product Active</TableHead>
          <TableHead>Terbuat</TableHead>
          <TableHead>TerUpdate</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          // Skeleton State
          Array.from({ length: 5 }).map((_, index) => (
            <SkeletonTable key={index} idx={index} />
          ))
        ) : !data || data.length === 0 ? (
          // Empty State
          <EmptyStateTable colSpan={10} />
        ) : (
          // Data State
          data.map((item) => (
            <SubProductEditTable
              key={item.id}
              item={item}
              onSave={onUpdate}
              onDelete={onDelete}
              savePending={savePending}
              deletedPending={deletePending}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
}
