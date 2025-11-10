"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const env_1 = require("./config/env");
const app_1 = require("./app");
const prisma_1 = require("./config/prisma");
const app = (0, app_1.createApp)();
const server = (0, http_1.createServer)(app);
const port = env_1.env.port;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
const shutdown = async (signal) => {
    console.log(`Received ${signal}. Closing server.`);
    server.close(async () => {
        await (0, prisma_1.disconnectPrisma)();
        process.exit(0);
    });
};
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
//# sourceMappingURL=server.js.map