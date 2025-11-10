"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOrderSchema = void 0;
const zod_1 = require("zod");
exports.placeOrderSchema = zod_1.z.object({
    body: zod_1.z
        .array(zod_1.z.object({
        productId: zod_1.z.string().uuid("Invalid productId"),
        quantity: zod_1.z
            .number()
            .int("quantity must be an integer")
            .min(1, "quantity must be at least 1"),
    }))
        .min(1, "At least one product is required"),
});
//# sourceMappingURL=order.schemas.js.map