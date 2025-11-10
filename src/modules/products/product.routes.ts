import { Router } from "express";
import { Role } from "../../generated/prisma/client";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  createProductSchema,
  listProductsSchema,
  productIdParamSchema,
  updateProductSchema,
} from "./product.schemas";
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  listProductsHandler,
  updateProductHandler,
} from "./product.controller";

const router = Router();

router.get("/", validate(listProductsSchema), listProductsHandler);
router.get("/:id", validate(productIdParamSchema), getProductHandler);

router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  validate(createProductSchema),
  createProductHandler,
);

router.put(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  validate(updateProductSchema),
  updateProductHandler,
);

router.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  validate(productIdParamSchema),
  deleteProductHandler,
);

export const productRouter = router;

