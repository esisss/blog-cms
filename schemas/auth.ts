import { z } from "zod";
import {
  emailSchema,
  idSchema,
  nonEmptyTextSchema,
  passwordSchema,
} from "./primitives";

export const registerInputSchema = z
  .object({
    name: nonEmptyTextSchema,
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export const loginInputSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export const userSessionSchema = z
  .object({
    userId: idSchema,
    name: nonEmptyTextSchema,
    email: emailSchema,
  })
  .strict();
