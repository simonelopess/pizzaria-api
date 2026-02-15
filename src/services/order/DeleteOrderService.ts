import prismaClient from "../../prisma";

interface DeleteOrderServiceProps {
  order_id: string;
}

class DeleteOrderService {
  async execute({ order_id }: DeleteOrderServiceProps) {
    try {
      const order = await prismaClient.order.findFirst({
        where: { id: order_id },
      });
      if (!order) {
        throw new Error("Pedido não encontrado");
      }
      await prismaClient.order.delete({
        where: { id: order_id },
      });
      return { message: "Pedido deletado com sucesso" };
    } catch (error) {
      throw new Error("Falha ao deletar pedido");
    }
  }
}

export { DeleteOrderService };
