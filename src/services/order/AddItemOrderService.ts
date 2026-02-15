import prismaClient from "../../prisma";

interface AddItemOrderServiceProps {
  order_id: string;
  product_id: string;
  amount: number;
}

class AddItemOrderService {
  async execute({ order_id, product_id, amount }: AddItemOrderServiceProps) {
   
    try {
      const order = await prismaClient.order.findFirst({
        where: { id: order_id },
      });
      
      if (!order) {
        throw new Error("Pedido não encontrado");
      }

      const product = await prismaClient.product.findFirst({
        where: { 
            id: product_id,  
            disabled: false, 
        },

      });

      if (!product) {
        throw new Error("Produto não encontrado");
      }
      const item = await prismaClient.item.create({
        data: { order_id, product_id, amount },
        select: {
          id: true,
          amount: true,
          order_id: true,
          product_id: true,
          product: {
            select: {
              name: true,
              price: true,
              banner: true,
              description: true,
            },
          },
          createdAt: true,
        },
      });
      return item;
    } catch (error) {
      throw new Error("Falha ao adicionar item ao pedido");
    }
  }
}

export { AddItemOrderService };