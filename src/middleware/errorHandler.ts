import { NextFunction, Request, Response } from "express";
import { AppError } from "../common/errors";
import { sendResponse } from "../common/response";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return sendResponse(res, err.statusCode, err.message, null, err.errors);
  }

  console.error(err);
  return sendResponse(res, 500, "Internal server error", null, ["Internal server error"]);
};

