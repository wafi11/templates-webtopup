import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { ProductItems } from "@repo/types";
import { formatDate, formatPrice } from "@/utils/FormatTimestamp";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonTable } from "@/components/ui/skeleton-table";
import { ProductItemEditTable } from "./ProductItemEditTable";

interface ProductsItemTableProps {
  data: ProductItems[];
  isLoading?: boolean;
  onSave: (item: ProductItems) => void;
  onDelete: (id: number) => void;
  savePending: boolean;
  deletedPending: boolean;
}

export function ProductsItemTable({
  data,
  isLoading = false,
  onSave,
  onDelete,
  savePending,
  deletedPending,
}: ProductsItemTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product Id</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Product Code</TableHead>
          <TableHead>Sub Product ID</TableHead>
          <TableHead>Base Price</TableHead>
          <TableHead>Discount Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Best Seller</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Active</TableHead>
          <TableHead>Terbuat</TableHead>
          <TableHead>TerUpdate</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={13}
              className="text-center text-muted-foreground"
            >
              Tidak ada data produk
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, idx) =>
            isLoading ? (
              <SkeletonTable idx={idx} />
            ) : (
              <ProductItemEditTable
                deletePending={deletedPending}
                item={item}
                onDelete={onDelete}
                onSave={onSave}
                savePending={savePending}
              />
            ),
          )
        )}
      </TableBody>
    </Table>
  );
}
