import { ShoppingBagIcon } from "lucide-react";

interface ButtonPesanSekarangProps {
  handleSubmit: () => void;
  order: {
    product: string;
    item: string;
    price: number;
    quantity: number;
    total: number;
    fee: number;
    image: string;
  };
}

function OrderSummaryCard({
  order,
}: {
  order: ButtonPesanSekarangProps["order"];
}) {
  const hasItem = order.item !== "" && order.product !== "";

  if (!hasItem) {
    return null; // mobile/desktop empty state handled separately
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={order.image}
          alt={order.item}
          className="h-12 w-12 rounded-md object-cover sm:h-14 sm:w-14"
        />
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="truncate text-sm font-semibold text-foreground">
          {order.item}
        </div>
        <div className="text-xs text-muted-foreground">{order.product}</div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            x{order.quantity}
          </span>
          <span className="text-sm font-semibold text-foreground">
            {order.total.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ height }: { height: string }) {
  return (
    <div className="rounded-lg border border-dashed bg-secondary text-sm text-secondary-foreground">
      <div
        className="flex items-center justify-center text-center text-xs text-muted-foreground"
        style={{ height }}
      >
        Belum ada item produk yang dipilih.
      </div>
    </div>
  );
}

function FeeRow({ fee }: { fee: number }) {
  if (fee <= 0) return null;
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>Biaya Layanan</span>
      <span>
        +{" "}
        {fee.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        })}
      </span>
    </div>
  );
}

export function ButtonPesanSekarang({
  handleSubmit,
  order,
}: ButtonPesanSekarangProps) {
  const hasItem = order.item !== "" && order.product !== "";

  return (
    <>
      {/* Mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 w-full space-y-3 rounded-t-lg border-t bg-secondary/95 p-4 shadow-lg backdrop-blur-sm lg:hidden">
        {hasItem ? (
          <>
            <OrderSummaryCard order={order} />
            <FeeRow fee={order.fee} />
            <div className="flex items-center justify-between border-t pt-2">
              <span className="text-sm font-semibold text-foreground">
                Total
              </span>
              <span className="text-base font-bold text-foreground">
                {(order.total + order.fee).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>
          </>
        ) : (
          <EmptyState height="4em" />
        )}

        <button
          onClick={handleSubmit}
          disabled={!hasItem}
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 h-10 shadow-sm text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50"
        >
          <ShoppingBagIcon className="h-4 w-4" />
          <span>Pesan Sekarang!</span>
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden space-y-3 lg:block">
        {hasItem ? (
          <>
            <OrderSummaryCard order={order} />
            <div className="rounded-lg border bg-background p-3">
              <FeeRow fee={order.fee} />
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-semibold text-foreground">
                  Total
                </span>
                <span className="text-base font-bold text-foreground">
                  {(order.total + order.fee).toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
            </div>
          </>
        ) : (
          <EmptyState height="98px" />
        )}

        <button
          onClick={handleSubmit}
          disabled={!hasItem}
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 h-10 shadow-sm text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50"
        >
          <ShoppingBagIcon className="h-4 w-4" />
          <span>Pesan Sekarang!</span>
        </button>
      </div>
    </>
  );
}
