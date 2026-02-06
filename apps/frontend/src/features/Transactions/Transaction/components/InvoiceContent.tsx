import { formatCurrency } from "@/utils/FormatTimestamp";
import { Invoice } from "../types";
import Image from "next/image";

export function InvoiceContent({ transaction }: { transaction: Invoice }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background py-8">
      <div className="container mx-auto px-4">
        {/* Header with Status */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-foreground">
                Informasi Produk
              </h2>
              <div className="flex gap-5">
                <div className="flex-shrink-0">
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden ring-2 ring-primary/20 shadow-md">
                    <Image
                      width={100}
                      height={100}
                      alt={transaction.productName}
                      className="object-cover w-full h-full"
                      src={transaction.productImage}
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-xl text-foreground mb-1">
                    {transaction.productName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {transaction.productItemName}
                  </p>
                  <p className="text-sm mt-2 text-muted-foreground">
                    {transaction.destination}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-foreground">
                Rincian Harga
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-muted-foreground">Jumlah</span>
                  <span className="font-semibold text-foreground">
                    {transaction.quantity}x
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-muted-foreground">Harga</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(transaction.price)}
                  </span>
                </div>

                {transaction.serialNumber && (
                  <div className="flex justify-between items-center pb-3 border-b border-border/50">
                    <span className="text-muted-foreground">Serial Number</span>
                    <span className="font-mono font-semibold text-foreground">
                      {transaction.serialNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-5 text-foreground">
                Rincian Pembayaran
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Payment</span>
                  <span className="font-medium text-foreground">
                    {transaction.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>

                {transaction.discount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Diskon</span>
                    <span className="font-medium text-green-600">
                      -{formatCurrency(transaction.discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Pajak</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(transaction.tax)}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-foreground">
                    Total Pembayaran
                  </span>
                  <span className="font-bold text-2xl text-primary">
                    {formatCurrency(transaction.total)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {transaction.status === "PENDING" && transaction.paymentUrl && (
                <a
                  href={transaction.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 rounded-xl font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
                    Bayar Sekarang
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
