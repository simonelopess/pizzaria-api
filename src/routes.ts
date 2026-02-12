import { Router, Request, Response } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { validateSchema } from "./middlewares/validateSchemas";
import { createUserSchema } from "./schemas/userSchema";

const router = Router();

router.post("/users", validateSchema(createUserSchema), new CreateUserController().handle)

export { router }