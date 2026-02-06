import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChecklistIcon } from "@/utils/svg";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { PropsItem } from "../types";

interface DialogOrderValidationProps {
  referenceId: string;
  open: boolean;
  item: PropsItem;
  setOpen: (open: boolean) => void;
}

export function DialogOrderValidation({
  open,
  referenceId,
  item,
  setOpen,
}: DialogOrderValidationProps) {
  const [animate, setAnimate] = useState(false);
  const { push } = useRouter();
  useEffect(() => {
    if (open) {
      setAnimate(false);
      const timeout = setTimeout(() => setAnimate(true), 100);
      return () => clearTimeout(timeout);
    }
    setAnimate(false);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <div>
          <div className="my-8 flex justify-center">
            <ChecklistIcon animate={animate} />
          </div>
          <div className="text-center text-sm">
            <h3 className="text-lg font-semibold leading-6 text-foreground">
              Buat Pesanan
            </h3>
            <p className="pt-1">
              Pastikan data akun Kamu dan produk yang Kamu pilih valid dan
              sesuai.
            </p>
            <div className="mt-2">
              <div className="my-4 grid grid-cols-3 gap-3 rounded-md bg-secondary/50 p-4 text-left text-sm text-secondary-foreground">
                <div className="line-clamp-1">Username</div>
                <div className="col-span-2 truncate">{item.nickname}</div>
                <div className="line-clamp-1">ID</div>
                <div className="col-span-2 truncate">{item.gameId}</div>
                <div className="line-clamp-1">Server</div>
                <div className="col-span-2 truncate">{item.zoneId}</div>
                <div className="line-clamp-1">Item</div>
                <div className="col-span-2 truncate">{item.item}</div>
                <div className="line-clamp-1">Product</div>
                <div className="col-span-2 truncate">{item.product}</div>
                <div className="line-clamp-1">Payment</div>
                <div className="col-span-2 truncate">{item.payment}</div>
              </div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="pt-1">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 cursor-pointer rounded border bg-background text-primary focus:ring-primary focus:ring-offset-background"
                  checked
                  readOnly
                />
              </div>
            </div>
            <div className="text-[12px] pt-1 ml-2">
              <span>
                Dengan mengklik{" "}
                <span className="font-semibold text-primary">
                  Pesan Sekarang
                </span>
                , kamu sudah menyetujui{" "}
                <a
                  href="/terms-and-condition"
                  className="text-primary font-semibold"
                  target="_blank"
                >
                  Syarat &amp; Ketentuan
                </a>{" "}
                yang berlaku
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:mt-5 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            onClick={() => push(`/invoice/${referenceId}`)}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 h-8 shadow-sm text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50"
            type="button"
          >
            Pesan Sekarang!
          </button>
          <button
            onClick={() => setOpen(false)}
            className="inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-secondary px-4 h-8 shadow-sm text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50"
            type="button"
          >
            Batalkan
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
