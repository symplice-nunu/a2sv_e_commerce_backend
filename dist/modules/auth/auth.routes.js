"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const validate_1 = require("../../middleware/validate");
const auth_schemas_1 = require("./auth.schemas");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post("/register", (0, validate_1.validate)(auth_schemas_1.registerSchema), auth_controller_1.registerHandler);
router.post("/login", (0, validate_1.validate)(auth_schemas_1.loginSchema), auth_controller_1.loginHandler);
exports.authRouter = router;
//# sourceMappingURL=auth.routes.js.map