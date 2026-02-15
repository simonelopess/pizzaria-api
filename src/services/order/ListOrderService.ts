import prismaClient from "../../prisma";

interface ListOrdersServiceProps {
draft?:string;
}

class ListOrdersService {
  async execute({ draft }: ListOrdersServiceProps) {
    const orders = await prismaClient.order.findMany({
        where: {
            draft: draft === "true" ? true : false,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            table: true,
            status: true,
            draft: true,
            name: true,
            createdAt: true,
            items: {
                select: {
                    id: true,
                    amount: true,
                    product: {
                        select: {
                            name: true,
                            price: true,
                            banner: true,
                            description: true,
                        },
                    },
                },
            },
        },
    });
    return orders;
  }
}

export { ListOrdersService };