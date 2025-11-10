"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const app_1 = require("../src/app");
const prisma_1 = require("./mocks/prisma");
jest.mock("../src/config/prisma", () => {
    const { mockPrisma } = require("./mocks/prisma");
    return {
        prisma: mockPrisma,
        disconnectPrisma: jest.fn(),
    };
});
const app = (0, app_1.createApp)();
const ROLE_USER = "USER";
describe("Auth Routes", () => {
    beforeEach(() => {
        (0, prisma_1.resetMockPrisma)();
    });
    it("registers a new user", async () => {
        prisma_1.mockPrisma.user.findUnique
            .mockResolvedValueOnce(null) // email
            .mockResolvedValueOnce(null); // username
        prisma_1.mockPrisma.user.create.mockResolvedValueOnce({
            id: "user-1",
            username: "john123",
            email: "john@example.com",
            password: "hashed",
            role: ROLE_USER,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const response = await (0, supertest_1.default)(app).post("/auth/register").send({
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
        prisma_1.mockPrisma.user.findUnique.mockResolvedValueOnce({
            id: "user-1",
            username: "john123",
            email: "john@example.com",
            password: "hashed",
            role: ROLE_USER,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const response = await (0, supertest_1.default)(app).post("/auth/register").send({
            username: "john123",
            email: "john@example.com",
            password: "Password123!",
        });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });
    it("logs in a user", async () => {
        const hashed = await bcrypt_1.default.hash("Password123!", 10);
        prisma_1.mockPrisma.user.findUnique.mockResolvedValueOnce({
            id: "user-1",
            username: "john123",
            email: "john@example.com",
            password: hashed,
            role: ROLE_USER,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const response = await (0, supertest_1.default)(app).post("/auth/login").send({
            email: "john@example.com",
            password: "Password123!",
        });
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.object.token).toBeDefined();
    });
    it("rejects invalid credentials", async () => {
        prisma_1.mockPrisma.user.findUnique.mockResolvedValueOnce(null);
        const response = await (0, supertest_1.default)(app).post("/auth/login").send({
            email: "john@example.com",
            password: "WrongPass1!",
        });
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });
});
//# sourceMappingURL=auth.test.js.map