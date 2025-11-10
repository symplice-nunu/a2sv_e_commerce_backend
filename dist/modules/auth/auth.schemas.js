"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z
            .string()
            .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric")
            .min(3, "Username must be at least 3 characters long")
            .max(30, "Username must be at most 30 characters long"),
        email: zod_1.z
            .string()
            .email("Email must be a valid email address")
            .max(255, "Email must be at most 255 characters long"),
        password: zod_1.z
            .string()
            .regex(passwordRegex, "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Email must be a valid email address"),
        password: zod_1.z.string().min(1, "Password must not be empty"),
    }),
});
//# sourceMappingURL=auth.schemas.js.map