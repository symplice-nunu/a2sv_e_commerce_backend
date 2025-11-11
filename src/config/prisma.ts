import { PrismaClient } from "../generated/prisma/client";
import { env } from "./env";

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.databaseUrl,
    },
  },
});

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

