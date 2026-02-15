import prismaClient from "../../prisma";

interface SendOrderServiceProps {
  order_id: string;
  name: string;
}

class SendOrderService {
  async execute({ order_id, name}: SendOrderServiceProps) {
    try {
      const order = await prismaClient.order.findFirst({
        where: { id: order_id },
      });
      if (!order) {
        throw new Error("Pedido não encontrado");
      }
      const orderUpdated = await prismaClient.order.update({
        where: { id: order_id },
        data: { draft: false, name: name },
        select: {
          id: true,
          table: true,
          status: true,
          draft: true,
          name: true,
          createdAt: true,
        },
      });
      return orderUpdated;
    } catch (error) {
      throw new Error("Falha ao enviar pedido");
    }
  }
}

export { SendOrderService };