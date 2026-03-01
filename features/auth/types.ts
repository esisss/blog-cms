import type { z } from "zod";
import type {
  loginInputSchema,
  registerInputSchema,
  userSessionSchema,
} from "@/schemas/auth";

export type LoginInput = z.infer<typeof loginInputSchema>;
export type RegisterInput = z.infer<typeof registerInputSchema>;
export type UserSession = z.infer<typeof userSessionSchema>;
