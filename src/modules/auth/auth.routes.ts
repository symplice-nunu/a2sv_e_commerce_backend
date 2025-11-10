import { Router } from "express";
import { validate } from "../../middleware/validate";
import { loginSchema, registerSchema } from "./auth.schemas";
import { registerHandler, loginHandler } from "./auth.controller";

const router = Router();

router.post("/register", validate(registerSchema), registerHandler);
router.post("/login", validate(loginSchema), loginHandler);

export const authRouter = router;

