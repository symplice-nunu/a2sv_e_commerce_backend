"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyOrdersHandler = exports.placeOrderHandler = void 0;
const response_1 = require("../../common/response");
const order_service_1 = require("./order.service");
const placeOrderHandler = async (req, res) => {
    if (!req.user) {
        return;
    }
    const order = await (0, order_service_1.placeOrder)(req.user.userId, req.body);
    return (0, response_1.sendResponse)(res, 201, "Order placed successfully", order);
};
exports.placeOrderHandler = placeOrderHandler;
const getMyOrdersHandler = async (req, res) => {
    if (!req.user) {
        return;
    }
    const orders = await (0, order_service_1.getUserOrders)(req.user.userId);
    return (0, response_1.sendResponse)(res, 200, "Orders retrieved successfully", orders);
};
exports.getMyOrdersHandler = getMyOrdersHandler;
//# sourceMappingURL=order.controller.js.map