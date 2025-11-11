import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

const nodeEnv = getEnv("NODE_ENV", "development");
const isProduction = nodeEnv === "production";
const defaultDatabaseUrl = `file:${path.resolve(__dirname, "../../prisma/dev.db")}`;

export const env = {
  nodeEnv,
  port: Number(getEnv("PORT", "3000")),
  jwtSecret: getEnv("JWT_SECRET", isProduction ? undefined : "dev-jwt-secret"),
  jwtExpiresIn: getEnv("JWT_EXPIRES_IN", "1h"),
  databaseUrl: getEnv("DATABASE_URL", isProduction ? undefined : defaultDatabaseUrl),
  cacheTtlSeconds: Number(getEnv("CACHE_TTL_SECONDS", "60")),
};

if (!isProduction && process.env.JWT_SECRET === undefined) {
  console.warn(
    "[env] Falling back to default JWT secret. Set JWT_SECRET in your environment for production use."
  );
}

if (!isProduction && process.env.DATABASE_URL === undefined) {
  console.warn(
    `[env] Falling back to default sqlite DATABASE_URL at ${defaultDatabaseUrl}. Update DATABASE_URL if you prefer another database.`
  );
}

export { isProduction };

