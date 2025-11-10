"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const client_1 = require("../../generated/prisma/client");
const auth_1 = require("../../middleware/auth");
const validate_1 = require("../../middleware/validate");
const product_schemas_1 = require("./product.schemas");
const product_controller_1 = require("./product.controller");
const router = (0, express_1.Router)();
router.get("/", (0, validate_1.validate)(product_schemas_1.listProductsSchema), product_controller_1.listProductsHandler);
router.get("/:id", (0, validate_1.validate)(product_schemas_1.productIdParamSchema), product_controller_1.getProductHandler);
router.post("/", auth_1.authenticate, (0, auth_1.authorize)(client_1.Role.ADMIN), (0, validate_1.validate)(product_schemas_1.createProductSchema), product_controller_1.createProductHandler);
router.put("/:id", auth_1.authenticate, (0, auth_1.authorize)(client_1.Role.ADMIN), (0, validate_1.validate)(product_schemas_1.updateProductSchema), product_controller_1.updateProductHandler);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorize)(client_1.Role.ADMIN), (0, validate_1.validate)(product_schemas_1.productIdParamSchema), product_controller_1.deleteProductHandler);
exports.productRouter = router;
//# sourceMappingURL=product.routes.js.map