import { Router } from "express";
import multer from "multer";
import uploadConfig from "./config/multer";

import { CreateUserController } from "./controllers/user/CreateUserController";
import { validateSchema } from "./middlewares/validateSchemas";
import { createUserSchema, autheUserSchema } from "./schemas/userSchema";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { UserDetailController } from "./controllers/user/UserDetailController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { ListCategoriesController } from "./controllers/category/ListCategoriesController";
import { isAdmin } from "./middlewares/isAdmin";
import { createCategorySchema } from "./schemas/categorySchema";
import { CreateProductController } from "./controllers/product/CreateProductController";
import { DisableProductController } from "./controllers/product/DisableProductController";
import { ListProductsByCategoryController } from "./controllers/product/ListProductsByCategoryController";
import { ListProductsController } from "./controllers/product/ListProductsController";
import {
  deleteProductSchema,
  listProductsByCategorySchema,
  listProductsSchema,
  productSchema,
} from "./schemas/productSchema";
import { CreateOrderController } from "./controllers/order/CreateOrderController";
import {
  addItemOrderSchema,
  createOrderSchema,
  deleteOrderSchema,
  detailOrderSchema,
  finishOrderSchema,
  removeItemSchema,
  sendOrderSchema,
} from "./schemas/orderSchema";
import { ListOrderController } from "./controllers/order/ListOrderController";
import { AddItemController } from "./controllers/order/AddItemController";
import { RemoveItemController } from "./controllers/order/RemoveItemController";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { SendOrderController } from "./controllers/order/SendOrderController";
import { FinishOrderController } from "./controllers/order/FinishOrderController";
import { DeleteOrderController } from "./controllers/order/DeleteOrderController";

const router = Router();
const upload = multer(uploadConfig);

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

router.get(
  "/products",
  isAuthenticated,
  validateSchema(listProductsSchema),
  new ListProductsController().handle,
);

router.post(
  "/product",
  isAuthenticated,
  isAdmin,
  upload.single("file"),
  validateSchema(productSchema),
  new CreateProductController().handle,
);
router.delete(
  "/product",
  isAuthenticated,
  isAdmin,
  validateSchema(deleteProductSchema),
  new DisableProductController().handle,
);

router.get("/category", isAuthenticated, new ListCategoriesController().handle);
router.post(
  "/category",
  isAuthenticated,
  isAdmin,
  validateSchema(createCategorySchema),
  new CreateCategoryController().handle,
);

router.get(
  "/category/product",
  isAuthenticated,
  validateSchema(listProductsByCategorySchema),
  new ListProductsByCategoryController().handle,
);

router.post(
  "/order",
  isAuthenticated,
  validateSchema(createOrderSchema),
  new CreateOrderController().handle,
);

router.get("/order", isAuthenticated, new ListOrderController().handle);

router.get(
  "/order/detail",
  isAuthenticated,
  validateSchema(detailOrderSchema),
  new DetailOrderController().handle,
);

router.post(
  "/order/item",
  isAuthenticated,
  validateSchema(addItemOrderSchema),
  new AddItemController().handle,
);

router.delete(
  "/order/remove",
  isAuthenticated,
  validateSchema(removeItemSchema),
  new RemoveItemController().handle,
);

router.put(
  "/order/send",
  isAuthenticated,
  validateSchema(sendOrderSchema),
  new SendOrderController().handle,
);

router.put(
  "/order/finish",
  isAuthenticated,
  validateSchema(finishOrderSchema),
  new FinishOrderController().handle,
);

router.delete("/order", isAuthenticated, new DeleteOrderController().handle);

export { router };
