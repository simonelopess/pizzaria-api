import { Router, Request, Response } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { validateSchema } from "./middlewares/validateSchemas";
import { createUserSchema, autheUserSchema } from "./schemas/userSchema";
import { AuthUserController } from "./controllers/user/AuthUserController";

const router = Router();

router.post("/users", validateSchema(createUserSchema), new CreateUserController().handle)
router.post("/session", validateSchema(autheUserSchema), new AuthUserController().handle)

export { router }