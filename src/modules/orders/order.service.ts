import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../config/prisma";
import { badRequest, notFound, unauthorized } from "../../common/errors";
import { invalidateProductsCache } from "../products/product.service";

type OrderItemInput = {
  productId: string;
  quantity: number;
};

const toNumber = (value: Prisma.Decimal) => Number(value.toString());

export const placeOrder = async (userId: string, items: OrderItemInput[]) => {
  if (items.length === 0) {
    throw badRequest("Order must contain at least one product");
  }

  const productIds = items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== items.length) {
    const foundIds = new Set(products.map((product) => product.id));
    const missing = productIds.filter((id) => !foundIds.has(id));
    throw notFound(`Product(s) not found: ${missing.join(", ")}`);
  }

  const itemsWithProducts = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw notFound(`Product not found: ${item.productId}`);
    }
    if (item.quantity > product.stock) {
      throw badRequest(`Insufficient stock for product ${product.name}`);
    }
    if (item.quantity <= 0) {
      throw badRequest("Quantity must be greater than 0");
    }
    return { item, product };
  });

  const totalPrice = itemsWithProducts.reduce((sum, { item, product }) => {
    const price = toNumber(product.price);
    return sum + price * item.quantity;
  }, 0);

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        totalPrice: new Prisma.Decimal(totalPrice),
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

  invalidateProductsCache();

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

export const getUserOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
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

