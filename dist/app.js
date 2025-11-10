"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_routes_1 = require("./modules/auth/auth.routes");
const product_routes_1 = require("./modules/products/product.routes");
const order_routes_1 = require("./modules/orders/order.routes");
const response_1 = require("./common/response");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use((0, morgan_1.default)(env_1.env.nodeEnv === "production" ? "combined" : "dev"));
    app.get("/health", (_req, res) => (0, response_1.sendResponse)(res, 200, "Service healthy", { uptime: process.uptime() }));
    app.use("/auth", auth_routes_1.authRouter);
    app.use("/products", product_routes_1.productRouter);
    app.use("/orders", order_routes_1.orderRouter);
    app.use("*", (_req, res) => (0, response_1.sendResponse)(res, 404, "Route not found", null, ["Not found"]));
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map