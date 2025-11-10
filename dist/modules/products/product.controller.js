"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProductsHandler = exports.getProductHandler = exports.deleteProductHandler = exports.updateProductHandler = exports.createProductHandler = void 0;
const response_1 = require("../../common/response");
const product_service_1 = require("./product.service");
const createProductHandler = async (req, res) => {
    if (!req.user) {
        return;
    }
    const product = await (0, product_service_1.createProduct)({
        ...req.body,
        userId: req.user.userId,
    });
    return (0, response_1.sendResponse)(res, 201, "Product created successfully", product);
};
exports.createProductHandler = createProductHandler;
const updateProductHandler = async (req, res) => {
    const product = await (0, product_service_1.updateProduct)(req.params.id, req.body);
    return (0, response_1.sendResponse)(res, 200, "Product updated successfully", product);
};
exports.updateProductHandler = updateProductHandler;
const deleteProductHandler = async (req, res) => {
    await (0, product_service_1.deleteProduct)(req.params.id);
    return (0, response_1.sendResponse)(res, 200, "Product deleted successfully", { id: req.params.id });
};
exports.deleteProductHandler = deleteProductHandler;
const getProductHandler = async (req, res) => {
    const product = await (0, product_service_1.getProductById)(req.params.id);
    return (0, response_1.sendResponse)(res, 200, "Product retrieved successfully", product);
};
exports.getProductHandler = getProductHandler;
const listProductsHandler = async (req, res) => {
    const { page, pageSize, search } = req.query;
    const { items, total } = await (0, product_service_1.listProducts)(page, pageSize, search);
    return (0, response_1.sendPaginatedResponse)(res, 200, "Products retrieved successfully", items, page, pageSize, total);
};
exports.listProductsHandler = listProductsHandler;
//# sourceMappingURL=product.controller.js.map