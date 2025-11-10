"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHandler = exports.registerHandler = void 0;
const response_1 = require("../../common/response");
const auth_service_1 = require("./auth.service");
const registerHandler = async (req, res) => {
    const user = await (0, auth_service_1.registerUser)(req.body);
    return (0, response_1.sendResponse)(res, 201, "User registered successfully", user);
};
exports.registerHandler = registerHandler;
const loginHandler = async (req, res) => {
    const result = await (0, auth_service_1.loginUser)(req.body);
    return (0, response_1.sendResponse)(res, 200, "Login successful", result);
};
exports.loginHandler = loginHandler;
//# sourceMappingURL=auth.controller.js.map