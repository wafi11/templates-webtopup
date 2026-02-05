import z from "zod";
import {
  validationEmail,
  validationPassword,
  validationUsername,
} from "./validation";

export const validationRegister = z.object({
  fullname: validationUsername("fullname"),
  email: validationEmail(),
  password: validationPassword(),
});

export type RegisterAuth = z.infer<typeof validationRegister>;
export type CreateUser = RegisterAuth & {
  password: string;
  password_hash: string;
  avatar_url: string | null;
};
