import { CheckCircle2, CreditCard, Loader2, ShoppingBag } from "lucide-react";
import { Invoice } from "../types";
export const statusToCurrentStep: Record<Invoice["status"], number> = {
  PENDING: 0, // aktif di "Pembayaran"
  PAID: 1, // aktif di "Sedang Di Proses"
  PROCESS: 2, // aktif di "Sedang Di Proses"
  SUCCESS: 3, // aktif di "Transaksi Selesai"
  FAILED: 1, // balik ke "Pembayaran"
};
export const steps = [
  {
    label: "Transaksi Dibuat",
    desc: "Transaksi telah berhasil dibuat",
    Icon: ShoppingBag,
  },
  {
    label: "Pembayaran",
    desc: "Silakan melakukan pembayaran",
    Icon: CreditCard,
  },

  {
    label: "Sedang Di Proses",
    desc: "Pembelian sedang dalam proses.",
    Icon: Loader2,
  },
  {
    label: "Transaksi Selesai",
    desc: "Transaksi telah berhasil dilakukan.",
    Icon: CheckCircle2,
  },
];
