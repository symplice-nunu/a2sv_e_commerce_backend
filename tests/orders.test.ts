import request from "supertest";
import jwt from "jsonwebtoken";
import { createApp } from "../src/app";
import { mockPrisma, resetMockPrisma } from "./mocks/prisma";

jest.mock("../src/config/prisma", () => {
  const { mockPrisma } = require("./mocks/prisma");
  return {
    prisma: mockPrisma,
    disconnectPrisma: jest.fn(),
  };
});

const app = createApp();
const ROLE_USER = "USER";

const decimal = (value: number) =>
  ({
    toString: () => value.toString(),
  }) as unknown as { toString(): string };

const userToken = jwt.sign(
  {
    userId: "user-1",
    username: "user",
    role: ROLE_USER,
  },
  process.env.JWT_SECRET ?? "test-secret",
);

const productId = "550e8400-e29b-41d4-a716-446655440000";

describe("Order Routes", () => {
  beforeEach(() => {
    resetMockPrisma();
  });

  it("places an order successfully", async () => {
    mockPrisma.product.findMany.mockResolvedValueOnce([
      {
        id: productId,
        name: "Product 1",
        description: "A product",
        price: decimal(10),
        stock: 5,
        category: "Cat",
        userId: "admin-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    mockPrisma.order.create.mockImplementationOnce(async () => ({
      id: "order-1",
      userId: "user-1",
      description: null,
      totalPrice: decimal(20),
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      orderItems: [
        {
          id: "order-item-1",
          orderId: "order-1",
          productId: productId,
          quantity: 2,
          price: decimal(10),
        },
      ],
    }));

    mockPrisma.product.update.mockResolvedValueOnce({
      id: productId,
      name: "Product 1",
      description: "A product",
      price: decimal(10),
      stock: 3,
      category: "Cat",
      userId: "admin-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

    const response = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send([
        {
          productId: productId,
          quantity: 2,
        },
      ]);

    expect(response.status).toBe(201);
    expect(response.body.object).toMatchObject({
      id: "order-1",
      totalPrice: 20,
      items: [
        {
          productId: productId,
          quantity: 2,
        },
      ],
    });
  });

  it("fails when stock is insufficient", async () => {
    mockPrisma.product.findMany.mockResolvedValueOnce([
      {
        id: productId,
        name: "Product 1",
        description: "A product",
        price: decimal(10),
        stock: 1,
        category: "Cat",
        userId: "admin-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const response = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send([
        {
          productId: productId,
          quantity: 2,
        },
      ]);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("fetches user orders", async () => {
    mockPrisma.order.findMany.mockResolvedValueOnce([
      {
        id: "order-1",
        userId: "user-1",
        description: null,
        totalPrice: decimal(20),
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        orderItems: [
          {
            id: "order-item-1",
            orderId: "order-1",
            productId: productId,
            quantity: 2,
            price: decimal(10),
          },
        ],
      },
    ]);

    const response = await request(app)
      .get("/orders")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.object).toHaveLength(1);
    expect(response.body.object[0].items).toHaveLength(1);
  });
});

