import prismaClient from "../../prisma";

interface RemoveItemServiceProps {
  item_id: string;
}

class RemoveItemService {
  async execute({ item_id }: RemoveItemServiceProps) {
    const item = await prismaClient.item.findFirst({
      where: {
        id: item_id,
      },
    });

    if (!item) {
      throw new Error("Item não encontrado");
    }

    await prismaClient.item.delete({
      where: {
        id: item_id,
      },
    });

    return { message: "Item removido com sucesso" };
  }
}

export { RemoveItemService };
