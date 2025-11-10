"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = require("express");
const client_1 = require("../../generated/prisma/client");
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const order_schemas_1 = require("./order.schemas");
const order_controller_1 = require("./order.controller");
const router = (0, express_1.Router)();
router.post("/", auth_1.authenticate, (0, auth_1.authorize)(client_1.Role.USER), (0, validate_1.validate)(order_schemas_1.placeOrderSchema), order_controller_1.placeOrderHandler);
router.get("/", auth_1.authenticate, order_controller_1.getMyOrdersHandler);
exports.orderRouter = router;
//# sourceMappingURL=order.routes.js.map