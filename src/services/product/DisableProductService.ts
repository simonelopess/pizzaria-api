import prismaClient from "../../prisma";

interface DisableProductServiceProps {
  id: string;
}

class DisableProductService {
  async execute({ id }: DisableProductServiceProps) {
    const product = await prismaClient.product.findFirst({
      where: { id },
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    await prismaClient.product.update({
      where: { id },
      data: { disabled: true },
    });

    return { message: "Produto desabilitado com sucesso" };
  }
}

export { DisableProductService };
