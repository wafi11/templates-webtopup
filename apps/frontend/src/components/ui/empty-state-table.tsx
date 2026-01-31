import { TableCell, TableRow } from "@/components/ui/table";
import { PackageOpen } from "lucide-react";

interface EmptyStateTableProps {
  colSpan?: number;
  message?: string;
}

export function EmptyStateTable({
  colSpan = 8,
  message = "Tidak ada data yang tersedia",
}: EmptyStateTableProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-64">
        <div className="flex flex-col items-center justify-center text-center gap-3">
          <div className="rounded-full bg-muted p-4">
            <PackageOpen className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-lg">{message}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Mulai dengan menambahkan data baru
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
