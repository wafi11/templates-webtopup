import z from "zod";
import { validationMinAndMaxValue } from "./validation";
export enum CALCULATION_TYPE {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
  HYBRID = "HYBIRD",
}

export const validationPaymentMethod = z.object({
  name: validationMinAndMaxValue(3, "Payment Method Name", 100),
  description: validationMinAndMaxValue(3, "Payemnt Method Description", 100),
  code: validationMinAndMaxValue(3, "Payment Method Code", 100),
  image: validationMinAndMaxValue(10, "Image", 200),
  margin_amount: z.number().min(0),
  margin_percentage: z.number().min(0),
  calculation_type: z.string(), // Gunakan enum
});

export type RequestValidationPaymentMethod = z.infer<
  typeof validationPaymentMethod
>;

export type PaymentMethod = {
  id: number;
  created_at: string | null;
  name: string;
  code: string;
  method: string | null;
  description: string | null;
  image: string | null;
  margin_percentage: string;
  margin_amount: number;
  calculation_type: string | null;
  updated_at: string | null;
};

export class ClassRequestPaymentMethod {
  name!: string;
  description!: string;
  image!: string;
  margin_percentage!: number;
  margin_amount!: number;
  calculation_type!: CALCULATION_TYPE;
  code!: string;
}
