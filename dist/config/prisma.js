"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectPrisma = exports.prisma = void 0;
const client_1 = require("../generated/prisma/client");
const env_1 = require("./env");
exports.prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: env_1.env.databaseUrl,
        },
    },
});
const disconnectPrisma = async () => {
    await exports.prisma.$disconnect();
};
exports.disconnectPrisma = disconnectPrisma;
//# sourceMappingURL=prisma.js.map