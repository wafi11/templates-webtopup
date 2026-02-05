import z from "zod";
import { validationMinAndMaxValue } from "./validation";

export const validationVoucher = z.object({
  name: validationMinAndMaxValue(7, "Voucher Name", 100),
  code: validationMinAndMaxValue(4, "Voucher Code", 10),
  description: validationMinAndMaxValue(
    0,
    "Voucher Description",
    200,
  ).nullable(),
  marginPercentage: z.string(),
  marginAmount: z.number(),
  calculationType: validationMinAndMaxValue(3, "Voucher Calculation", 20),
  onlyProduct: z.boolean(),
  productIds: z.string().nullable(),
  maxUsage: z.number(),
  currentUsage: z.number(),
  maxUsagePerUser: z.number(),
  startedAt: z.date(),
  endAt: z.date(),
});

export type RequestVoucher = z.infer<typeof validationVoucher>;

export type Voucher = {
  id: number;
  created_at: string | null;
  name: string;
  products: string | null;
  code: string;
  description: string | null;
  margin_percentage: string;
  margin_amount: number;
  calculation_type: string | null;
  update_at: string | null;
  only_product: boolean | null;
  max_usage: number | null;
  current_usage: number;
  max_usage_per_user: number | null;
  started_at: string;
  end_at: string;
};
