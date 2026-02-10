import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionStatus } from "../Transaction/types";
import { OrderInvoice } from "./types";
import { formatCurrency, formatDate } from "@/utils/FormatTimestamp";
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2 } from "lucide-react";
import { useTableSort } from "@/hooks/useTableSort";
import { Button } from "@/components/ui/button";

interface TableOrderProps {
  orders: OrderInvoice[] | undefined;
}
export function TableOrder({ orders }: TableOrderProps) {
  const { sortField, sortOrder, sortedData, handleSort } = useTableSort(orders);

  const getSortIcon = (field: keyof OrderInvoice) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };
  const getStatusBadge = (status: TransactionStatus) => {
    return <Badge variant={status}>{[status]}</Badge>;
  };

  if (!orders) {
    return (
      <div className="flex justify-center min-h-screen items-center">
        <Loader2 className="animate-spin size-20" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Destination</TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("price")}>
              Harga Modal {getSortIcon("price")}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("amount")}>
              Harga Jual {getSortIcon("amount")}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("discount")}>
              Discount {getSortIcon("discount")}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("total")}>
              Total {getSortIcon("total")}
            </Button>
          </TableHead>
          <TableHead>Method</TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("status")}>
              Status {getSortIcon("status")}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("created_at")}>
              Date {getSortIcon("created_at")}
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData?.map((order,idx) => (
          <TableRow key={idx}>
            <TableCell className="font-medium">
              {order.invoice_number}
            </TableCell>
            <TableCell>{order.product_code}</TableCell>
            <TableCell>{order.destination}</TableCell>
            <TableCell className="text-center">
              {formatCurrency(order.price)}
            </TableCell>
            <TableCell className="text-center">
              {formatCurrency(order.amount)}
            </TableCell>
            <TableCell className="text-center">
              {formatCurrency(order.discount)}
            </TableCell>
            <TableCell className="text-center">
              {formatCurrency(order.total)}
            </TableCell>
            <TableCell>{order.payment_method}</TableCell>
            <TableCell>{getStatusBadge(order.status)}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(order.created_at)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
