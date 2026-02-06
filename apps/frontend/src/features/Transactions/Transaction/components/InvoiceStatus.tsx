import { TransactionStatus } from "../types";
import { statusToCurrentStep, steps } from "./status";

export function InvoiceStatus({ status }: { status: TransactionStatus }) {
  const currentStep = statusToCurrentStep[status];
  const isFailed = status === "FAILED";

  return (
    <div className="mt-8 space-y-4 lg:space-y-12">
      <div className="container flex flex-col items-start gap-4">
        <h3 className="font-semibold">Progress Transaksi</h3>

        {isFailed && (
          <p className="text-sm text-red-500 font-medium">
            Pembayaran gagal. Silakan coba lagi.
          </p>
        )}

        <nav className="w-full">
          <ol className="flex w-full justify-between overflow-hidden">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep || status === "SUCCESS";
              const isActive = index === currentStep;
              const isFailedStep = isFailed && index === 1; // highlight step "Pembayaran" saat failed

              // Styling circle
              const circleClass = isCompleted
                ? "bg-success border-success"
                : isFailedStep
                  ? "border-red-500 bg-background"
                  : isActive
                    ? "border-primary bg-background"
                    : "border-border/75 bg-background group-hover:border-gray-400";

              // Styling label
              const labelClass = isCompleted
                ? "text-success"
                : isFailedStep
                  ? "text-red-500"
                  : isActive
                    ? "text-primary"
                    : "text-foreground";

              const { Icon } = step;

              return (
                <li key={index} className="relative w-full flex items-start">
                  {/* Garis SEBELUM circle (dari step sebelumnya) */}
                  {index > 0 && (
                    <div
                      className={`mt-4 h-0.5 flex-1 ${
                        index <= currentStep || status === "SUCCESS"
                          ? "bg-success"
                          : "bg-muted"
                      }`}
                    />
                  )}

                  {/* Step content */}
                  <div className="group relative flex flex-col items-center">
                    {/* Circle + Icon */}
                    <span className="flex h-9 items-center">
                      <span
                        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${circleClass}`}
                      >
                        <Icon
                          className={`h-4 w-4 ${
                            isCompleted
                              ? "text-white"
                              : isFailedStep
                                ? "text-red-500"
                                : isActive
                                  ? "text-primary"
                                  : "text-foreground/50"
                          }`}
                        />
                      </span>
                    </span>

                    {/* Label + Deskripsi */}
                    <span className={`mt-2 flex flex-col text-center lg:flex `}>
                      <span className={`text-base font-semibold ${labelClass}`}>
                        {step.label}
                      </span>
                      <span className="text-xs text-foreground">
                        {isFailedStep ? "Pembayaran gagal." : step.desc}
                      </span>
                    </span>
                  </div>

                  {/* Garis SETELAH circle (menuju step berikutnya) */}
                  {index < steps.length - 1 && (
                    <div
                      className={`mt-4 h-0.5 flex-1 ${
                        index < currentStep || status === "SUCCESS"
                          ? "bg-success"
                          : "bg-muted"
                      }`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
