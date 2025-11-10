import request from "supertest";
import bcrypt from "bcrypt";
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

describe("Auth Routes", () => {
  beforeEach(() => {
    resetMockPrisma();
  });

  it("registers a new user", async () => {
    mockPrisma.user.findUnique
      .mockResolvedValueOnce(null) // email
      .mockResolvedValueOnce(null); // username
    mockPrisma.user.create.mockResolvedValueOnce({
      id: "user-1",
      username: "john123",
      email: "john@example.com",
      password: "hashed",
      role: ROLE_USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app).post("/auth/register").send({
      username: "john123",
      email: "john@example.com",
      password: "Password123!",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.object).toMatchObject({
      id: "user-1",
      username: "john123",
      email: "john@example.com",
      role: "USER",
    });
  });

  it("rejects duplicate email", async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: "user-1",
      username: "john123",
      email: "john@example.com",
      password: "hashed",
      role: ROLE_USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app).post("/auth/register").send({
      username: "john123",
      email: "john@example.com",
      password: "Password123!",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("logs in a user", async () => {
    const hashed = await bcrypt.hash("Password123!", 10);
    mockPrisma.user.findUnique.mockResolvedValueOnce({
      id: "user-1",
      username: "john123",
      email: "john@example.com",
      password: hashed,
      role: ROLE_USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app).post("/auth/login").send({
      email: "john@example.com",
      password: "Password123!",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.object.token).toBeDefined();
  });

  it("rejects invalid credentials", async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);

    const response = await request(app).post("/auth/login").send({
      email: "john@example.com",
      password: "WrongPass1!",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

