"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrders = exports.placeOrder = void 0;
const client_1 = require("../../generated/prisma/client");
const prisma_1 = require("../../config/prisma");
const errors_1 = require("../../common/errors");
const product_service_1 = require("../products/product.service");
const toNumber = (value) => Number(value.toString());
const placeOrder = async (userId, items) => {
    if (items.length === 0) {
        throw (0, errors_1.badRequest)("Order must contain at least one product");
    }
    const productIds = items.map((item) => item.productId);
    const products = await prisma_1.prisma.product.findMany({
        where: { id: { in: productIds } },
    });
    if (products.length !== items.length) {
        const foundIds = new Set(products.map((product) => product.id));
        const missing = productIds.filter((id) => !foundIds.has(id));
        throw (0, errors_1.notFound)(`Product(s) not found: ${missing.join(", ")}`);
    }
    const itemsWithProducts = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
            throw (0, errors_1.notFound)(`Product not found: ${item.productId}`);
        }
        if (item.quantity > product.stock) {
            throw (0, errors_1.badRequest)(`Insufficient stock for product ${product.name}`);
        }
        if (item.quantity <= 0) {
            throw (0, errors_1.badRequest)("Quantity must be greater than 0");
        }
        return { item, product };
    });
    const totalPrice = itemsWithProducts.reduce((sum, { item, product }) => {
        const price = toNumber(product.price);
        return sum + price * item.quantity;
    }, 0);
    const order = await prisma_1.prisma.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
            data: {
                userId,
                totalPrice: new client_1.Prisma.Decimal(totalPrice),
                status: "pending",
                orderItems: {
                    create: itemsWithProducts.map(({ item, product }) => ({
                        productId: product.id,
                        quantity: item.quantity,
                        price: product.price,
                    })),
                },
            },
            include: {
                orderItems: true,
            },
        });
        for (const { item, product } of itemsWithProducts) {
            await tx.product.update({
                where: { id: product.id },
                data: { stock: product.stock - item.quantity },
            });
        }
        return createdOrder;
    });
    (0, product_service_1.invalidateProductsCache)();
    return {
        id: order.id,
        userId: order.userId,
        status: order.status,
        totalPrice,
        createdAt: order.createdAt,
        items: order.orderItems.map((orderItem) => ({
            id: orderItem.id,
            productId: orderItem.productId,
            quantity: orderItem.quantity,
            price: toNumber(orderItem.price),
        })),
    };
};
exports.placeOrder = placeOrder;
const getUserOrders = async (userId) => {
    const orders = await prisma_1.prisma.order.findMany({
        where: { userId },
        include: {
            orderItems: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return orders.map((order) => ({
        id: order.id,
        status: order.status,
        totalPrice: toNumber(order.totalPrice),
        createdAt: order.createdAt,
        items: order.orderItems.map((orderItem) => ({
            id: orderItem.id,
            productId: orderItem.productId,
            quantity: orderItem.quantity,
            price: toNumber(orderItem.price),
        })),
    }));
};
exports.getUserOrders = getUserOrders;
//# sourceMappingURL=order.service.js.map