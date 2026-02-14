import prismaClient from "../../prisma";

class ListCategoriesService {
  async execute() {
    try {
      const categories = await prismaClient.category.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      });

      return categories;
    } catch (error) {
      throw new Error("Falha ao listar categorias");
    }
  }
}

export { ListCategoriesService };
