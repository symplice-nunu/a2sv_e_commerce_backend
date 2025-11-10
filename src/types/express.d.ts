import type { Role } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface UserInfo {
      userId: string;
      username: string;
      role: Role;
    }

    interface Request {
      user?: UserInfo;
    }
  }
}

export {};

