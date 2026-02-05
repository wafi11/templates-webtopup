import z from "zod";

const numericStringSchema = z
  .string()
  .regex(/^\d+$/, "Must be a string containing only digits")
  .transform((val) => parseInt(val, 10));

export const validationRequestParams = z.object({
  limit: numericStringSchema.default("10"),
  offset: numericStringSchema.default("0"),
  search: z.string().nullable(),
});

export class ClassRequestParams {
  limit: number = 10;
  offset: number = 0;
  search?: string | null = null;
}

export type RequestParams = z.infer<typeof validationRequestParams>;

export type ResponseCheckNickname = {
  success: boolean;
  game: string;
  id: string;
  server?: string;
  name: string;
};
