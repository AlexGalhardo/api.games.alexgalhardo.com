"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envsLocalValidator = void 0;
const zod_1 = require("zod");
exports.envsLocalValidator = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["local"]),
    PORT: zod_1.z.number().optional().default(3000),
    API_KEY_ADMIN: zod_1.z.string(),
    USE_JSON_DATABASE: zod_1.z.enum(["true", "false"]),
    LOG_PRISMA_QUERIES: zod_1.z.enum(["true", "false"]),
    ENABLE_TELEGRAM_LOGS: zod_1.z.enum(["true", "false"]),
    ENABLE_ERRSOLE: zod_1.z.enum(["true", "false"]),
    APP_FRONT_URL_DEV: zod_1.z.string(),
    APP_FRONT_URL_PROD: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string(),
    TELEGRAM_BOT_HTTP_TOKEN: zod_1.z.string(),
    TELEGRAM_BOT_CHANNEL_ID: zod_1.z.string(),
    SMTP_HOST: zod_1.z.string(),
    SMTP_PORT: zod_1.z.string(),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASSWORD: zod_1.z.string().optional(),
    SMTP_EMAIL_FROM: zod_1.z.string(),
    LOCALE_DATE_TIME: zod_1.z.string().default("pt-BR"),
    DATABASE_URL: zod_1.z.string().default("postgres://postgres:postgres@localhost:5432/postgres_api_games?schema=public"),
    DATABASE_HOST: zod_1.z.string(),
    DATABASE_USERNAME: zod_1.z.string(),
    DATABASE_PASSWORD: zod_1.z.string(),
    DATABASE_NAME: zod_1.z.string(),
    STRIPE_SK_TEST: zod_1.z.string(),
    GOOGLE_CLIENT_ID: zod_1.z.string(),
    GOOGLE_CLIENT_SECRET: zod_1.z.string(),
    GITHUB_CLIENT_ID: zod_1.z.string(),
    GITHUB_CLIENT_SECRET: zod_1.z.string(),
    NOOB_API_REQUESTS_PER_DAY: zod_1.z.number().default(20),
    CASUAL_API_REQUESTS_PER_DAY: zod_1.z.number().default(500),
    PRO_API_REQUESTS_PER_DAY: zod_1.z.number().default(2000),
});
//# sourceMappingURL=envs-local.validator.js.map