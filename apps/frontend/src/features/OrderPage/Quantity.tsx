import { Button } from "@/components/ui/button";
import { SectionContainer } from "./SectionContainer";
import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface SectionQuantityProps {
  quantity: number;
  setQuantity: (qty: number) => void;
}
export function SectionQuantity({
  quantity,
  setQuantity,
}: SectionQuantityProps) {
  return (
    <SectionContainer id={3} title="Masukkan Jumlah Pembelian">
      <div className="p-4">
        <div className="flex items-center gap-x-4">
          <div className="flex-1">
            <div className="flex w-full flex-col items-start">
              <Input
                value={quantity}
                type="number"
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="relative block h-9 w-full appearance-none rounded-lg border border-border bg-input px-3 text-xs text-foreground placeholder-muted-foreground/50 focus:z-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-75"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="inline-flex items-center justify-center whitespace-nowrap transition-all rounded-lg shadow-sm text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 w-9"
            >
              <Plus />
            </Button>
            <Button
              type="button"
              onClick={() => setQuantity(quantity - 1)}
              className="inline-flex items-center justify-center whitespace-nowrap transition-all rounded-lg shadow-sm text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 w-9"
            >
              <Minus />
            </Button>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
