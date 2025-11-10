import { PrismaClient } from "../generated/prisma/client";

export const prisma = new PrismaClient();

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

