import { z } from "zod";

export const productSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "O nome do produto precisa ser um texto" })
      .min(1, "O nome do produto precisa ter no mínimo 1 letra"),
    price: z
      .string({ message: "O preço do produto precisa ser um número" })
      .min(1, "O preço do produto precisa ser maior que 0"),
    description: z
      .string({ message: "A descrição do produto precisa ser um texto" })
      .min(1, "A descrição do produto precisa ter no mínimo 10 letras"),
    category_id: z
      .string({
        message: "O id da categoria precisa ser um texto",
      })
      .min(1, "O id da categoria é obrigatório"),
  }),
});
