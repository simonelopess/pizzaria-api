import prismaClient from "../../prisma";

interface ListProductsServiceProps {
  disabled: string | undefined;
}

class ListProductsService {
  async execute({ disabled }: ListProductsServiceProps) {
    try {
      const products = await prismaClient.product.findMany({
        where: {
          disabled: disabled === "true" ? true : false,
        },
        orderBy: {
          name: "desc",
        },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          category_id: true,
          banner: true,
          disabled: true,
          createdAt: true,
        },
      });

      return products;
    } catch (error) {
      throw new Error("Falha ao listar produtos");
    }
  }
}

export { ListProductsService };
