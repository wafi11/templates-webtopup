import { Invoice } from "../types";
import { InvoiceContent } from "./InvoiceContent";
import { InvoiceStatus } from "./InvoiceStatus";

export function InvoiceContainer({ transaction }: { transaction: Invoice }) {
  return (
    <div>
      <InvoiceStatus status={transaction.status} />
      <InvoiceContent transaction={transaction} />
    </div>
  );
}
