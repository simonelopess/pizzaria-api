import { sign } from "jsonwebtoken";
import prismaClient from "../../prisma";
import { compare } from "bcryptjs";

interface AuthServiceProps {
  email: string;
  password: string;
}

class AuthUserService {
  async execute({ email, password }: AuthServiceProps) {
    const user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("Email/Senha é obrigatório");
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Email/Senha é obrigatório");
    }

    //GERA TOKEN JWT

    const token = sign(
      {
        name: user.name,
        emai: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: "3d",
      },
    );

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      token,
    };
  }
}

export { AuthUserService };
