import "express-async-errors";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./modules/auth/auth.routes";
import { productRouter } from "./modules/products/product.routes";
import { orderRouter } from "./modules/orders/order.routes";
import { sendResponse } from "./common/response";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

  app.get("/health", (_req, res) =>
    sendResponse(res, 200, "Service healthy", { uptime: process.uptime() }),
  );

  app.use("/auth", authRouter);
  app.use("/products", productRouter);
  app.use("/orders", orderRouter);

  app.use("*", (_req, res) => sendResponse(res, 404, "Route not found", null, ["Not found"]));
  app.use(errorHandler);

  return app;
};

