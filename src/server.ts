import { createServer } from "http";
import { env } from "./config/env";
import { createApp } from "./app";
import { disconnectPrisma } from "./config/prisma";

const app = createApp();
const server = createServer(app);

const port = env.port;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const shutdown = async (signal: string) => {
  console.log(`Received ${signal}. Closing server.`);
  server.close(async () => {
    await disconnectPrisma();
    process.exit(0);
  });
};

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

