"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.signJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const secret = env_1.env.jwtSecret;
const signOptions = {
    expiresIn: env_1.env.jwtExpiresIn,
};
const signJwt = (payload) => jsonwebtoken_1.default.sign(payload, secret, signOptions);
exports.signJwt = signJwt;
const verifyJwt = (token) => jsonwebtoken_1.default.verify(token, secret);
exports.verifyJwt = verifyJwt;
//# sourceMappingURL=jwt.js.map