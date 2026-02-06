import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SkeletonTable } from "@/components/ui/skeleton-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Voucher } from "@repo/types";
import { useRouter } from "next/router";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

interface VoucherTableProps {
  vouchers: Voucher[];
  isLoading: boolean;
  onDelete: (id: number) => void;
}

export function VoucherTable({
  vouchers,
  isLoading,
  onDelete,
}: VoucherTableProps) {
  const { push } = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    voucher: Voucher | null;
  }>({ isOpen: false, voucher: null });

  const handleDelete = () => {
    if (deleteDialog.voucher) {
      onDelete(deleteDialog.voucher.id);
      setDeleteDialog({ isOpen: false, voucher: null });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Margin Amount</TableHead>
            <TableHead className="text-right">Margin %</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-center">Only Product</TableHead>
            <TableHead className="text-right">Usage</TableHead>
            <TableHead className="text-right">Max Per User</TableHead>
            <TableHead>Started At</TableHead>
            <TableHead>End At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Render skeleton rows
            Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonTable key={idx} idx={idx} />
            ))
          ) : vouchers.length === 0 ? (
            // Empty state
            <TableRow>
              <TableCell
                colSpan={13}
                className="text-center py-8 text-muted-foreground"
              >
                No vouchers found
              </TableCell>
            </TableRow>
          ) : (
            // Actual data
            vouchers.map((voucher) => (
              <TableRow key={voucher.id}>
                <TableCell className="font-medium">{voucher.id}</TableCell>
                <TableCell>{voucher.name}</TableCell>
                <TableCell>
                  <code className="px-2 py-1 bg-muted rounded text-sm">
                    {voucher.code}
                  </code>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {voucher.description || "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  Rp {voucher.margin_amount.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {voucher.margin_percentage}%
                </TableCell>
                <TableCell>
                  <span className="capitalize">
                    {voucher.calculation_type || "N/A"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  {voucher.only_product ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      Yes
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      No
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm">
                    {voucher.current_usage}
                    {voucher.max_usage && ` / ${voucher.max_usage}`}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {voucher.max_usage_per_user || "Unlimited"}
                </TableCell>
                <TableCell>
                  {new Date(voucher.started_at).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>
                  {new Date(voucher.end_at).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        push(`/dashboard/transactions/vouchers/${voucher.code}`)
                      }
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteDialog({ isOpen: true, voucher })}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <DialogDeleteVoucher
        isOpen={deleteDialog.isOpen}
        voucherName={deleteDialog.voucher?.name || ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, voucher: null })}
      />
    </>
  );
}

function DialogDeleteVoucher({
  isOpen,
  voucherName,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  voucherName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Voucher</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete voucher{" "}
            <strong>"{voucherName}"</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
