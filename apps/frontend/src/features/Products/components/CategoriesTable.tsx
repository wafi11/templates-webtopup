import { EmptyStateTable } from "@/components/ui/empty-state-table";
import { SkeletonTable } from "@/components/ui/skeleton-table";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Categories, CategoriesRequest } from "@repo/types";
import { CategoriesEditTable } from "./CategoriesEditTable";

interface CategoriesTableProps {
  data: Categories[];
  onDelete: (id: number) => void;
  onUpdate: (data: Categories) => void;
  isLoading?: boolean;
}

export function CategoriesTable({
  data,
  isLoading,
  onDelete,
  onUpdate,
}: CategoriesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Category Name</TableHead>
          <TableHead>Category Icon</TableHead>
          <TableHead>Category Order</TableHead>
          <TableHead>Category Active</TableHead>
          <TableHead>Terbuat</TableHead>
          <TableHead>TerUpdate</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          // Skeleton State
          Array.from({ length: 5 }).map((_, index) => (
            <SkeletonTable idx={index} />
          ))
        ) : !data || data.length === 0 ? (
          // Empty State
          <EmptyStateTable />
        ) : (
          // Data State
          data.map((item) => (
            <TableRow key={item.id}>
              <CategoriesEditTable
                item={item}
                onDelete={onDelete}
                onSave={onUpdate}
                isPending={isLoading}
              />
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
