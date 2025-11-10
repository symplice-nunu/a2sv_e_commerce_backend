"use strict";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";
process.env.PORT = process.env.PORT ?? "3000";
process.env.DATABASE_URL = process.env.DATABASE_URL ?? "mysql://user:pass@localhost:3306/test";
process.env.NODE_ENV = "test";
process.env.CACHE_TTL_SECONDS = "1";
//# sourceMappingURL=setupEnv.js.map