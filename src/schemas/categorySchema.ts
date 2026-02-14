import { z } from "zod";

export const createCategory = z.object({
  body: z.object({
    name: z
      .string({ message: "O nome da categoria precisa ser um texto" })
      .min(3, "O nome da categoria precisa ter no mínimo 3 letras"),
  }),
});
