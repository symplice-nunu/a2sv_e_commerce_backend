import { Router } from "express";
import { Role } from "../../generated/prisma/client";
import { authenticate, authorize } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { placeOrderSchema } from "./order.schemas";
import { getMyOrdersHandler, placeOrderHandler } from "./order.controller";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(Role.USER),
  validate(placeOrderSchema),
  placeOrderHandler,
);

router.get("/", authenticate, getMyOrdersHandler);

export const orderRouter = router;

