import { DashboardHeader } from "@/components/layouts/DashboardHeader";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  useFindOneVoucher,
  useUpdateVoucher,
} from "@/features/Transactions/Vouchers/api/VoucherApi";
import { FormVoucher } from "@/features/Transactions/Vouchers/components/FormVoucher";
import { CALCULATION_TYPE, RequestVoucher } from "@repo/types";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function UpdateDashboard() {
  const params = useParams();
  const code = params?.slug as string;

  // Fetch data
  const { data, isLoading, isError } = useFindOneVoucher(code);

  const { mutate, isPending } = useUpdateVoucher();

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardHeader title="Update Voucher" />
        <div className="min-h-screen w-full flex justify-center items-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  // Error or no data
  if (isError || !data?.data) {
    return (
      <DashboardLayout>
        <DashboardHeader title="Update Voucher" />
        <div className="min-h-screen w-full flex justify-center items-center">
          <p className="text-destructive">Failed to load voucher data</p>
        </div>
      </DashboardLayout>
    );
  }

  const voucher = data.data;

  // Handle submit
  const handleSubmit = (formData: RequestVoucher) => {
    mutate(
      { id: voucher.id, data: formData },
      //   {
      //     onSuccess: (ctx) => {
      //       toast.success(ctx.message);
      //     },
      //     onError: (ctx) => {
      //       toast.error(ctx.message);
      //     },
      //   },
    );
  };

  return (
    <DashboardLayout>
      <DashboardHeader title="Update Voucher" />
      <FormVoucher
        submitLabel="Update Voucher"
        onSubmit={handleSubmit}
        defaultValues={{
          code: voucher.code,
          name: voucher.name,
          description: voucher.description,
          onlyProduct: voucher.only_product as boolean,
          productIds: voucher.products,
          startedAt: new Date(voucher.started_at ?? Date.now()),
          endAt: new Date(voucher.end_at ?? Date.now()),
          currentUsage: voucher.current_usage,
          marginAmount: voucher.margin_amount,
          marginPercentage: voucher.margin_percentage,
          maxUsage: voucher.max_usage as number,
          maxUsagePerUser: voucher.max_usage_per_user as number,
          calculationType: voucher.calculation_type as CALCULATION_TYPE,
        }}
        isLoading={isPending}
      />
    </DashboardLayout>
  );
}
