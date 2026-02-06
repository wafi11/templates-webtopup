import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/FormatTimestamp";
import { SvgOrder } from "@/utils/svg";
import { Check, Info } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFindSubProducts } from "../Products/api/SubProductApi";
import { SectionContainer } from "./SectionContainer";
import { ProductOrder } from "../Transactions/Transaction/types";
import { useFindProductItemOrder } from "../Products/api/ProductItemApi";

interface ProductItemsContainerProps {
  productId: number;
  product: ProductOrder;
  setProductOrder: (product: ProductOrder) => void;
}

export function ProductItemsContainer({
  productId,
  product,
  setProductOrder,
}: ProductItemsContainerProps) {
  const { data: subProductData } = useFindSubProducts({
    limit: 10,
    id: productId.toString(),
    offset: 0,
    search: null,
  });

  const [selectedSubProduct, setSelectedSubProduct] = useState<number>(0);
  const { data: productItemsData } = useFindProductItemOrder({
    req: {
      product: productId,
      sub_product: selectedSubProduct,
    },
  });

  const calculateDiscount = (
    basePrice: number,
    discountPrice: number | null,
  ) => {
    if (!discountPrice) return 0;
    return Math.round(((basePrice - discountPrice) / basePrice) * 100);
  };

  return (
    <SectionContainer id={2} className="" title="Pilih Nominal">
      <div className="p-4">
        {/* Sub Product Tabs */}
        {subProductData?.data && subProductData.data.length > 0 && (
          <Tabs
            value={selectedSubProduct.toString()}
            onValueChange={(value) => setSelectedSubProduct(parseInt(value))}
            className="mb-4"
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              {/* Tab "Semua" dengan value="0" */}
              <TabsTrigger value="0" className="flex items-center gap-2">
                Semua
              </TabsTrigger>

              {/* Tab untuk setiap sub product */}
              {subProductData.data
                .filter((sub) => sub.is_active)
                .sort((a, b) => a.order - b.order)
                .map((sub) => (
                  <TabsTrigger
                    key={sub.id}
                    value={sub.id.toString()}
                    className="flex items-center gap-2"
                  >
                    {sub.icon && (
                      <img src={sub.icon} alt={sub.name} className="h-4 w-4" />
                    )}
                    {sub.name}
                  </TabsTrigger>
                ))}
            </TabsList>
          </Tabs>
        )}

        {/* Product Items Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {productItemsData?.data
            ?.filter((item) => item.is_active && item.stock > 0)
            ?.sort((a, b) => a.order - b.order)
            ?.map((item) => {
              const discount = calculateDiscount(
                item.base_price,
                item.discount_price,
              );
              const isSelected = product.code === item.code;

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setProductOrder({
                      code: item.code as string,
                      name: item.name,
                      price: item.base_price,
                    });
                  }}
                  className={cn(
                    "group/variant relative flex min-h-[85px] cursor-pointer gap-4 rounded-xl border text-muted-foreground shadow-sm outline-none duration-300 bg-order-variant-background text-order-variant-foreground",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-muted",
                  )}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}

                  <span className="relative w-full">
                    <div className="absolute bottom-10 right-1">
                      <Info width={20} height={20} />
                    </div>
                    <span className="flex h-full flex-col justify-between divide-y divide-muted-foreground/10">
                      <div className="flex flex-col justify-start gap-1 p-3">
                        <span className="block text-left text-xs font-semibold">
                          {item.name}
                        </span>
                        <div className="flex w-full items-center gap-2 md:gap-3">
                          <div className="flex aspect-square w-6 items-center md:w-8">
                            <Image
                              alt="Icon Sub Product"
                              width={300}
                              height={300}
                              className="object-contain object-right duration-300 group-hover/variant:rotate-12 group-hover/flashsale:scale-110"
                              src={
                                "https://res.cloudinary.com/dikf91ikq/image/upload/v1769976091/mkstore/icon/29be163e-8baf-4ac4-9a54-cb8eddff9e1c_qmanap.webp"
                              }
                            />
                          </div>
                          <div>
                            {discount > 0 && item.discount_price && (
                              <span className="block text-xs line-through opacity-60">
                                {formatPrice(item.base_price)}
                              </span>
                            )}
                            <span className="flex items-center text-[14px] font-semibold text-primary md:text-[16px]">
                              {formatPrice(
                                item.discount_price || item.base_price,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex w-full items-end justify-end gap-1 rounded-b-xl bg-gradient-to-b from-muted to-muted/40 p-2">
                        <div className="h-fit w-fit rounded bg-white p-1">
                          <SvgOrder />
                        </div>
                      </div>
                    </span>
                  </span>
                </button>
              );
            })}
        </div>

        {/* Empty State */}
        {(!productItemsData?.data || productItemsData.data.length === 0) && (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">
              Tidak ada produk tersedia
            </p>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
