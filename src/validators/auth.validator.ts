import { z } from "zod";
import { registry } from "../openapi.ts";

export const RegisterSchema = registry.register(
  "Register",
  z.object({
    username: z.string().min(3).max(30),
    email: z.email(),
    password: z.string().min(6),
    name: z.string().min(2),
  }),
);

export const RefreshSchema = registry.register(
  "Refresh",
  z.object({
    refreshToken: z.string().min(1),
  }),
);

export const LoginSchema = registry.register(
  "Login",
  z.object({
    username: z.string(),
    password: z.string(),
  }),
);

export type RegisterBody = z.infer<typeof RegisterSchema>;
export type LoginBody = z.infer<typeof LoginSchema>;
export type RefreshBody = z.infer<typeof RefreshSchema>;
