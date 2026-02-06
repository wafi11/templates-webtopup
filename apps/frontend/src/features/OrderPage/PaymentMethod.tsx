import { useFindPaymentMethod } from "../Transactions/PaymentMethods/api/PaymentMethodApi";
import { SectionContainer } from "./SectionContainer";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MethodOrder } from "../Transactions/Transaction/hooks/useOrder";
import Image from "next/image";

interface SectionPaymentMethodProps {
  method: MethodOrder;
  setMethod: (method: MethodOrder) => void;
}

export function SectionPaymentMethod({
  method,
  setMethod,
}: SectionPaymentMethodProps) {
  const { data, isLoading } = useFindPaymentMethod({
    limit: 20,
    offset: 0,
    search: null,
  });

  const paymentMethodData = data?.data ?? [];
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(
    null,
  );
  const [expandedMethods, setExpandedMethods] = useState<string[]>([]);

  const groupedPaymentMethods = paymentMethodData.reduce(
    (acc, method) => {
      const methodType = method.method as string;
      if (!acc[methodType]) {
        acc[methodType] = [];
      }
      acc[methodType].push(method);
      return acc;
    },
    {} as Record<string, typeof paymentMethodData>,
  );

  const toggleExpand = (e: React.MouseEvent, methodType: string) => {
    e.stopPropagation();
    setExpandedMethods((prev) =>
      prev.includes(methodType)
        ? prev.filter((m) => m !== methodType)
        : [...prev, methodType],
    );
  };

  if (isLoading) {
    return (
      <SectionContainer id={4} title="Pilih Pembayaran">
        <div className="p-4">
          <div className="text-center text-muted-foreground">
            Loading payment methods...
          </div>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id={4} title="Pilih Pembayaran">
      <div className="p-4">
        <div className="flex w-full flex-col space-y-4">
          {Object.keys(groupedPaymentMethods).length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No payment methods available
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {Object.entries(groupedPaymentMethods).map(
                ([methodType, methods]) => (
                  <div
                    key={methodType}
                    className="border border-border rounded-lg overflow-hidden"
                  >
                    {/* Header - Method Group */}
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(e, methodType)}
                      className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm sm:text-base">
                          {methodType}
                        </span>
                        {/* Preview images saat collapsed */}
                        {!expandedMethods.includes(methodType) && (
                          <div className="flex items-center -space-x-2">
                            {methods
                              .filter((m) => m.image)
                              .slice(0, 4)
                              .map((m) => (
                                <div
                                  key={m.id}
                                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden flex-shrink-0"
                                >
                                  <img
                                    src={m.image as string}
                                    alt={m.name}
                                    className="h-full w-full object-contain"
                                  />
                                </div>
                              ))}
                            {methods.filter((m) => m.image).length > 4 && (
                              <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-background bg-muted flex items-center justify-center flex-shrink-0">
                                <span className="text-xs text-muted-foreground font-semibold">
                                  +{methods.filter((m) => m.image).length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {expandedMethods.includes(methodType) ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>

                    {/* Expanded Content - Payment Method List */}
                    {expandedMethods.includes(methodType) && (
                      <div
                        role="radiogroup"
                        aria-labelledby={`payment-group-${methodType}`}
                        className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2"
                      >
                        {methods.map((method) => (
                          <div
                            key={method.id}
                            className={`relative flex cursor-pointer rounded-lg border p-2.5 text-muted-foreground shadow-sm outline-none duration-300 hover:ring-2 hover:ring-primary md:px-4 md:py-3 bg-border ${
                              selectedPaymentId === method.id
                                ? "border-primary ring-2 ring-primary"
                                : "border-border"
                            }`}
                            role="radio"
                            aria-checked={selectedPaymentId === method.id}
                            tabIndex={0}
                            onClick={() => {
                              setSelectedPaymentId(method.id);
                              setMethod({
                                calculation_type:
                                  method.calculation_type as string,
                                code: method.code,
                                fee_amount: method.margin_amount,
                                fee_percentage: parseInt(
                                  method.margin_percentage,
                                ),
                                name: method.name,
                              });
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setSelectedPaymentId(method.id);
                              }
                            }}
                          >
                            <div className="flex w-full items-center justify-between">
                              <div className="flex items-center gap-3">
                                {method.image && (
                                  <div className="flex-shrink-0">
                                    <Image
                                      width={100}
                                      height={100}
                                      src={method.image}
                                      alt={method.name}
                                      className="h-8 w-8 object-contain sm:h-10 sm:w-10"
                                    />
                                  </div>
                                )}
                                <div>
                                  <div className="block text-sm font-semibold">
                                    {method.name}
                                  </div>
                                  {method.description && (
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                      {method.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
