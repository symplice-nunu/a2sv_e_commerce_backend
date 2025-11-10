"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const client_1 = require("../../generated/prisma/client");
const prisma_1 = require("../../config/prisma");
const errors_1 = require("../../common/errors");
const password_1 = require("../../utils/password");
const jwt_1 = require("../../utils/jwt");
const registerUser = async ({ username, email, password }) => {
    const [existingEmail, existingUsername] = await Promise.all([
        prisma_1.prisma.user.findUnique({ where: { email } }),
        prisma_1.prisma.user.findUnique({ where: { username } }),
    ]);
    if (existingEmail) {
        throw (0, errors_1.badRequest)("Email already registered", ["Email already in use"]);
    }
    if (existingUsername) {
        throw (0, errors_1.badRequest)("Username already taken", ["Username already in use"]);
    }
    const passwordHash = await (0, password_1.hashPassword)(password);
    const user = await prisma_1.prisma.user.create({
        data: {
            username,
            email,
            password: passwordHash,
            role: client_1.Role.USER,
        },
    });
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };
};
exports.registerUser = registerUser;
const loginUser = async ({ email, password }) => {
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw (0, errors_1.unauthorized)("Invalid credentials");
    }
    const isPasswordValid = await (0, password_1.comparePassword)(password, user.password);
    if (!isPasswordValid) {
        throw (0, errors_1.unauthorized)("Invalid credentials");
    }
    const token = (0, jwt_1.signJwt)({
        userId: user.id,
        username: user.username,
        role: user.role,
    });
    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    };
};
exports.loginUser = loginUser;
//# sourceMappingURL=auth.service.js.map