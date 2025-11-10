import { NextFunction, Request, Response } from "express";
import { Role } from "../generated/prisma/client";
import { unauthorized, forbidden } from "../common/errors";
import { verifyJwt } from "../utils/jwt";

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw unauthorized("Authentication token missing");
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const payload = verifyJwt(token);
    req.user = {
      userId: payload.userId,
      username: payload.username,
      role: payload.role as Role,
    };
    return next();
  } catch {
    throw unauthorized("Invalid or expired token");
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw unauthorized("Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw forbidden("You do not have permission to perform this action");
    }

    return next();
  };
};

