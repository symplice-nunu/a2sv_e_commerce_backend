"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateProductsCache = exports.listProducts = exports.getProductById = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const client_1 = require("../../generated/prisma/client");
const prisma_1 = require("../../config/prisma");
const errors_1 = require("../../common/errors");
const env_1 = require("../../config/env");
const cache_1 = require("../../config/cache");
const productCache = (0, cache_1.createCache)(env_1.env.cacheTtlSeconds);
const toNumber = (value) => Number(value.toString());
const mapProduct = (product) => ({
    ...product,
    price: toNumber(product.price),
});
const buildCacheKey = (page, pageSize, search) => `products:${page}:${pageSize}:${search ?? ""}`;
const invalidateProductCache = () => {
    productCache.clear();
};
const createProduct = async (input) => {
    const product = await prisma_1.prisma.product.create({
        data: {
            name: input.name,
            description: input.description,
            price: new client_1.Prisma.Decimal(input.price),
            stock: input.stock,
            category: input.category,
            userId: input.userId,
        },
    });
    invalidateProductCache();
    return mapProduct(product);
};
exports.createProduct = createProduct;
const updateProduct = async (productId, input) => {
    const product = await prisma_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        throw (0, errors_1.notFound)("Product not found");
    }
    const updated = await prisma_1.prisma.product.update({
        where: { id: productId },
        data: {
            ...("price" in input && input.price !== undefined
                ? { price: new client_1.Prisma.Decimal(input.price) }
                : {}),
            ...("name" in input ? { name: input.name } : {}),
            ...("description" in input ? { description: input.description } : {}),
            ...("stock" in input ? { stock: input.stock } : {}),
            ...("category" in input ? { category: input.category } : {}),
        },
    });
    invalidateProductCache();
    return mapProduct(updated);
};
exports.updateProduct = updateProduct;
const deleteProduct = async (productId) => {
    const product = await prisma_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        throw (0, errors_1.notFound)("Product not found");
    }
    await prisma_1.prisma.product.delete({ where: { id: productId } });
    invalidateProductCache();
};
exports.deleteProduct = deleteProduct;
const getProductById = async (productId) => {
    const product = await prisma_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        throw (0, errors_1.notFound)("Product not found");
    }
    return mapProduct(product);
};
exports.getProductById = getProductById;
const listProducts = async (page, pageSize, search) => {
    const cacheKey = buildCacheKey(page, pageSize, search);
    const cached = productCache.get(cacheKey);
    if (cached) {
        return cached;
    }
    const where = search
        ? {
            name: {
                contains: search,
            },
        }
        : {};
    const [items, total] = await Promise.all([
        prisma_1.prisma.product.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.prisma.product.count({ where }),
    ]);
    const mapped = items.map(mapProduct);
    productCache.set(cacheKey, { items: mapped, total });
    return { items: mapped, total };
};
exports.listProducts = listProducts;
const invalidateProductsCache = () => invalidateProductCache();
exports.invalidateProductsCache = invalidateProductsCache;
//# sourceMappingURL=product.service.js.map