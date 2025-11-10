import { Request, Response } from "express";
import { sendResponse } from "../../common/response";
import { registerUser, loginUser } from "./auth.service";

export const registerHandler = async (req: Request, res: Response) => {
  const user = await registerUser(req.body);
  return sendResponse(res, 201, "User registered successfully", user);
};

export const loginHandler = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  return sendResponse(res, 200, "Login successful", result);
};

