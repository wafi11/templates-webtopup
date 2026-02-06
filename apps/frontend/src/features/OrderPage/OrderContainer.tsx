import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateTransaction } from "../Transactions/Transaction/api/useCreateTransaction";
import { DialogOrderValidation } from "../Transactions/Transaction/components/DialogOrderValidation";
import { useStoreOrder } from "../Transactions/Transaction/hooks/useOrder";
import { ButtonPesanSekarang } from "./ButtonPesanSekarang";
import { ContactSupport } from "./Contact";
import { DescriptionContainer } from "./DescriptionPage";
import { FormFieldsContainer } from "./FormFields";
import { SectionPaymentMethod } from "./PaymentMethod";
import { ProductItemsContainer } from "./ProductItemsContainer";
import { SectionQuantity } from "./Quantity";
import { RatingContainer } from "./RatingContainer";
import { SectionVoucher } from "./Voucher";

interface OrderContainerProps {
  productName: string;
  productImage: string;
  productId: number;
}

export function OrderContainer({
  productId,
  productImage,
  productName,
}: OrderContainerProps) {
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("transaksi"); // ✅ State untuk tab
  const { mutate } = useCreateTransaction();
  const {
    gameId,
    setGameId,
    phoneNumber,
    email,
    setPhoneNumber,
    setEmail,
    zoneId,
    method,
    setMethod,
    setProduct,
    setZoneId,
    quantity,
    setQuantity,
    setOpenDialog,
    openDialog,
    product,
    voucherCode,
    setVoucherCode,
    total,
    clearData,
  } = useStoreOrder();

  const handleSubmit = () => {
    mutate(
      {
        destination: gameId + zoneId,
        paymentCode: method.code,
        phoneNumber,
        productCode: product.code,
        quantity,
        email,
        voucherCode,
      },
      {
        onSuccess: (ctx) => {
          if (ctx.success) {
            setReferenceId(ctx.data.referenceId);
          }
          toast.success("Successfully Create Transaction");
          setOpenDialog(true);
        },
        onError: () => {
          toast.error("Failed to create transaction");
        },
      },
    );
  };

  return (
    <>
      <div className="mt-4 lg:mt-8">
        <div className="container flex w-full flex-col gap-4 lg:hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="h-10 w-full items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground">
              <TabsTrigger value="transaksi" className="w-full">
                Transaksi
              </TabsTrigger>
              <TabsTrigger value="keterangan" className="w-full">
                Keterangan
              </TabsTrigger>
            </TabsList>
            <TabsContent value="transaksi" className="mt-4">
              <div className="flex flex-col gap-4">
                <FormFieldsContainer
                  gameId={gameId}
                  productId={productId}
                  setGameId={setGameId}
                  setZoneId={setZoneId}
                  zoneId={zoneId}
                />
                <ProductItemsContainer
                  productId={productId}
                  product={product}
                  setProductOrder={setProduct}
                />
                <SectionQuantity
                  quantity={quantity}
                  setQuantity={setQuantity}
                />
                <SectionPaymentMethod method={method} setMethod={setMethod} />
                <ContactSupport
                  email={email}
                  phoneNumber={phoneNumber}
                  setEmail={setEmail}
                  setPhoneNumber={setPhoneNumber}
                />
                <SectionVoucher
                  voucherCode={voucherCode}
                  setVoucherCode={setVoucherCode}
                />
                <RatingContainer />
                <ButtonPesanSekarang
                  order={{
                    fee: 0,
                    image: productImage,
                    product: productName,
                    item: product.name,
                    price: product.price,
                    quantity: quantity,
                    total,
                  }}
                  handleSubmit={handleSubmit}
                />
              </div>
            </TabsContent>

            <TabsContent value="keterangan" className="mt-4">
              <DescriptionContainer />
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-0 hidden lg:block">
          <form className="container relative mt-8 grid grid-cols-3 gap-8">
            <div className="col-span-2 col-start-1 flex flex-col gap-8">
              <FormFieldsContainer
                gameId={gameId}
                productId={productId}
                setGameId={setGameId}
                setZoneId={setZoneId}
                zoneId={zoneId}
              />
              <ProductItemsContainer
                productId={productId}
                product={product}
                setProductOrder={setProduct}
              />
              <SectionQuantity quantity={quantity} setQuantity={setQuantity} />
              <SectionPaymentMethod method={method} setMethod={setMethod} />
              <ContactSupport
                email={email}
                phoneNumber={phoneNumber}
                setEmail={setEmail}
                setPhoneNumber={setPhoneNumber}
              />
              <SectionVoucher
                voucherCode={voucherCode}
                setVoucherCode={setVoucherCode}
              />
            </div>
            <div className="col-span-1">
              <div className="sticky top-[118px] flex flex-col gap-8">
                <RatingContainer />
                <ButtonPesanSekarang
                  order={{
                    fee: 0,
                    image: productImage,
                    product: productName,
                    item: product.name,
                    price: product.price,
                    quantity: quantity,
                    total,
                  }}
                  handleSubmit={handleSubmit}
                />
              </div>
            </div>
          </form>
          <div className="container mt-8">
            <DescriptionContainer />
          </div>
        </div>
      </div>

      {openDialog && (
        <DialogOrderValidation
          open={openDialog}
          item={{
            gameId,
            zoneId,
            item: product.name,
            payment: method.name,
            product: productName,
            nickname: "W F D N",
          }}
          referenceId={referenceId as string}
          setOpen={(open) => {
            setOpenDialog(open);
            if (!open) clearData();
          }}
        />
      )}
    </>
  );
}
