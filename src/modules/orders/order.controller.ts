import { Request, Response } from "express";
import { sendResponse } from "../../common/response";
import { placeOrder, getUserOrders } from "./order.service";

export const placeOrderHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return;
  }

  const order = await placeOrder(req.user.userId, req.body);
  return sendResponse(res, 201, "Order placed successfully", order);
};

export const getMyOrdersHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return;
  }

  const orders = await getUserOrders(req.user.userId);
  return sendResponse(res, 200, "Orders retrieved successfully", orders);
};

