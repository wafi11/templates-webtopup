import { DashboardHeader } from "@/components/layouts/DashboardHeader";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { PaymentMethodTable } from "../components/PaymentMethodTable";
import { useFindPaymentMethod } from "../api/PaymentMethodApi";

export default function DashboardPaymentMethod() {
  const { data } = useFindPaymentMethod({
    limit: 20,
    offset: 0,
    search: "",
  });
  const paymentMethodData = data?.data ?? [];
  return (
    <DashboardLayout>
      <DashboardHeader title="Manage Payment Method" />
      <PaymentMethodTable paymentMethod={paymentMethodData} />
    </DashboardLayout>
  );
}
