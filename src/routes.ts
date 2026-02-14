import { Router } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { validateSchema } from "./middlewares/validateSchemas";
import { createUserSchema, autheUserSchema } from "./schemas/userSchema";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { UserDetailController } from "./controllers/user/UserDetailController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { isAdmin } from "./middlewares/isAdmin";
import { createCategory } from "./schemas/categorySchema";

const router = Router();

router.post(
  "/users",
  validateSchema(createUserSchema),
  new CreateUserController().handle,
);
router.post(
  "/session",
  validateSchema(autheUserSchema),
  new AuthUserController().handle,
);
router.post("/me", isAuthenticated, new UserDetailController().handle);

router.post(
  "/category",
  isAuthenticated,
  isAdmin,
  validateSchema(createCategory),
  new CreateCategoryController().handle,
);
export { router };
