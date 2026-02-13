import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
  sub: string;
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      error: "Token não fornecido",
    });
  }

  const [, token] = authToken.split(" ");

  try {
    const { sub } = verify(token!, process.env.JWT_SECRET as string) as Payload;

    req.user_id = sub;
    // injeção de dependencia  do user id no req. Uma vez que injetado, user não precisa passar o id, ja é pego quando entra no middleware

    next();
  } catch (err) {
    res.status(401).json({
      message: "token inválido",
    });
  }
}
