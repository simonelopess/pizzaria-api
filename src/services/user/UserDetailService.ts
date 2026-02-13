import prismaClient from "../../prisma";

class UserDetailService {
  async execute(user_id: string) {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          id: user_id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.log(error);
      throw new Error("User not found");
    }
  }
}

export { UserDetailService };
