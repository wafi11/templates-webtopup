import z from "zod";

export const validationMinAndMaxValue = (
  min: number,
  value: string,
  max: number,
): z.ZodString => {
  return z
    .string()
    .min(min, {
      message: `${value} Min Length ${min} characters`,
    })
    .max(max, {
      message: `${value} Max Length ${max} characters`,
    });
};

export function convertToTimestamp(date: Date): string {
  return date.toISOString();
}
