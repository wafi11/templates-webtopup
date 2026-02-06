import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/FormatTimestamp";
import { PaymentMethod } from "@repo/types";
import { Edit, Image as ImageIcon, Trash2 } from "lucide-react";
import { CalculationBadge } from "./CalculationBadge";
import Image from "next/image";

interface PaymentMethodTableProps {
  paymentMethod: PaymentMethod[];
  onEdit?: (method: PaymentMethod) => void;
  onDelete?: (id: number) => void;
}

export function PaymentMethodTable({
  paymentMethod,
  onEdit,
  onDelete,
}: PaymentMethodTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead className="text-right">Margin Amount</TableHead>
            <TableHead className="text-right">Margin %</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentMethod.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="h-24 text-center text-muted-foreground"
              >
                No payment methods available
              </TableCell>
            </TableRow>
          ) : (
            paymentMethod.map((method) => (
              <TableRow key={method.id}>
                <TableCell className="font-mono text-sm">
                  #{method.id}
                </TableCell>

                <TableCell className="font-medium">
                  <div>
                    <div>{method.name}</div>
                    {method.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {method.description}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <code className="relative rounded bg-muted px-[0.5rem] py-[0.25rem] font-mono text-sm">
                    {method.code}
                  </code>
                </TableCell>

                <TableCell>
                  {method.image ? (
                    <Image
                      width={100}
                      height={100}
                      src={method.image}
                      alt={method.name}
                      className="h-10 w-auto rounded border object-contain"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded border bg-muted">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>

                <TableCell className="text-right font-mono">
                  Rp {method.margin_amount.toLocaleString("id-ID")}
                </TableCell>

                <TableCell className="text-right font-mono">
                  {method.margin_percentage}%
                </TableCell>

                <TableCell>
                  {CalculationBadge(method.calculation_type)}
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(method.created_at as string)}
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit?.(method)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete?.(method.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
