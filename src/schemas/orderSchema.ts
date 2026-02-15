import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    table: z
      .number({ message: "O número da mesa deve ser um número" })
      .int("O número da mesa deve ser um número inteiro")
      .positive(),
    name: z
      .string({ message: "O nome do cliente deve ser um texto" })
      .optional(),
  }),
});
