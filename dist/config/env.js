"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProduction = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getEnv = (key, fallback) => {
    const value = process.env[key] ?? fallback;
    if (value === undefined) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
};
exports.env = {
    nodeEnv: getEnv("NODE_ENV", "development"),
    port: Number(getEnv("PORT", "3000")),
    jwtSecret: getEnv("JWT_SECRET"),
    jwtExpiresIn: getEnv("JWT_EXPIRES_IN", "1h"),
    databaseUrl: getEnv("DATABASE_URL"),
    cacheTtlSeconds: Number(getEnv("CACHE_TTL_SECONDS", "60")),
};
exports.isProduction = exports.env.nodeEnv === "production";
//# sourceMappingURL=env.js.map