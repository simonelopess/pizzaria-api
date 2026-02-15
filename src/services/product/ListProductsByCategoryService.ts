import prismaClient from "../../prisma";

interface ListProductsByCategoryServiceProps {
  category_id: string;
}

class ListProductsByCategoryService {
  async execute({ category_id }: ListProductsByCategoryServiceProps) {
    try {
      const category = await prismaClient.category.findFirst({
        where: { id: category_id },
      });

      if (!category) {
        throw new Error("Categoria não encontrada");
      }

      const products = await prismaClient.product.findMany({
        where: {
          category_id,
          disabled: false,
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
      throw new Error("Falha ao listar produtos da categoria");
    }
  }
}

export { ListProductsByCategoryService };
