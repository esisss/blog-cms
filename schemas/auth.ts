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
    confirmPassword: passwordSchema,
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

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

export const authorSchema = z
  .object({
    id: idSchema,
    name: nonEmptyTextSchema,
    email: emailSchema,
  })
  .strict();

export const authorWithCountSchema = authorSchema.extend({
  articleCount: z.number().int().min(0),
});

export const getAuthorsSchema = z.array(authorWithCountSchema);

export type Author = z.infer<typeof authorSchema>;
export type AuthorWithCount = z.infer<typeof authorWithCountSchema>;
