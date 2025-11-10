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
const ROLE_ADMIN = "ADMIN";

const decimal = (value: number) =>
  ({
    toString: () => value.toString(),
  }) as unknown as { toString(): string };

const adminToken = jwt.sign(
  {
    userId: "admin-1",
    username: "admin",
    role: ROLE_ADMIN,
  },
  process.env.JWT_SECRET ?? "test-secret",
);

const productId = "550e8400-e29b-41d4-a716-446655440000";

describe("Product Routes", () => {
  beforeEach(() => {
    resetMockPrisma();
  });

  it("lists products with pagination", async () => {
    mockPrisma.product.findMany.mockResolvedValueOnce([
      {
        id: productId,
        name: "Product 1",
        description: "A wonderful product",
        price: decimal(10.5),
        stock: 5,
        category: "Category",
        userId: "admin-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    mockPrisma.product.count.mockResolvedValueOnce(1);

    const response = await request(app).get("/products?page=1&pageSize=10");

    expect(response.status).toBe(200);
    expect(response.body.object).toHaveLength(1);
    expect(response.body.object[0]).toMatchObject({
      id: productId,
      price: 10.5,
    });
  });

  it("retrieves product details", async () => {
    mockPrisma.product.findUnique.mockResolvedValueOnce({
      id: productId,
      name: "Product 1",
      description: "A wonderful product",
      price: decimal(10.5),
      stock: 5,
      category: "Category",
      userId: "admin-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app).get(`/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body.object).toMatchObject({
      id: productId,
      name: "Product 1",
    });
  });

  it("creates a product as admin", async () => {
    mockPrisma.product.create.mockResolvedValueOnce({
      id: productId,
      name: "Product 1",
      description: "A wonderful product",
      price: decimal(20),
      stock: 10,
      category: "Category",
      userId: "admin-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Product 1",
        description: "A wonderful product",
        price: 20,
        stock: 10,
        category: "Category",
      });

    expect(response.status).toBe(201);
    expect(response.body.object).toMatchObject({
      id: productId,
      price: 20,
    });
  });

  it("updates a product", async () => {
    const existing = {
      id: productId,
      name: "Product 1",
      description: "Old description",
      price: decimal(20),
      stock: 10,
      category: "Category",
      userId: "admin-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrisma.product.findUnique.mockResolvedValueOnce(existing);
    mockPrisma.product.update.mockResolvedValueOnce({
      ...existing,
      description: "New description",
    });

    const response = await request(app)
      .put(`/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        description: "New description",
      });

    expect(response.status).toBe(200);
    expect(response.body.object.description).toBe("New description");
  });

  it("deletes a product", async () => {
    const existing = {
      id: productId,
      name: "Product 1",
      description: "Old description",
      price: decimal(20),
      stock: 10,
      category: "Category",
      userId: "admin-1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockPrisma.product.findUnique.mockResolvedValueOnce(existing);

    const response = await request(app)
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.object).toMatchObject({ id: productId });
  });
});

