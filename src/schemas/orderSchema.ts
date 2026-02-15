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

export const addItemOrderSchema = z.object({
  body: z.object({
    order_id: z.string({ message: "O id do pedido deve ser um texto" }).min(1, "O id do pedido é obrigatório"),
    product_id: z.string({ message: "O id do produto deve ser um texto" }).min(1, "O id do produto é obrigatório"),
    amount: z.number({ message: "A quantidade deve ser um número" }).int("A quantidade deve ser um número inteiro").positive(),
  }),
});

export const removeItemSchema = z.object({
  query: z.object({
    item_id: z
      .string({ message: "O id do item é obrigatório" })
      .min(1, "O id do item é obrigatório"),
  }),
});

export const detailOrderSchema = z.object({
  query: z.object({
    order_id: z
      .string({ message: "O id do pedido é obrigatório" })
  }),
});