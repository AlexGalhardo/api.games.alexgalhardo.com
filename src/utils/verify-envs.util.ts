import "dotenv/config";
import { envsLocalValidator } from "src/validators/envs-local.validator";
import { envsProductionValidator } from "src/validators/envs-production.validator";

export default function verifyEnvs() {
	if (process.env.NODE_ENV === "local") {
		const envLocalVariables = {
			NODE_ENV: process.env.NODE_ENV,
			SERVER_PORT: Number(process.env.SERVER_PORT),
			API_KEY_ADMIN: process.env.API_KEY_ADMIN,
			USE_JSON_DATABASE: process.env.USE_JSON_DATABASE,
			LOG_PRISMA_QUERIES: process.env.LOG_PRISMA_QUERIES,
			ENABLE_TELEGRAM_LOGS: process.env.ENABLE_TELEGRAM_LOGS,
			APP_FRONT_URL_DEV: process.env.APP_FRONT_URL_DEV,
			APP_FRONT_URL_PROD: process.env.APP_FRONT_URL_PROD,
			JWT_SECRET: process.env.JWT_SECRET,
			TELEGRAM_BOT_HTTP_TOKEN: process.env.TELEGRAM_BOT_HTTP_TOKEN,
			TELEGRAM_BOT_CHANNEL_ID: process.env.TELEGRAM_BOT_CHANNEL_ID,
			SMTP_HOST: process.env.SMTP_HOST,
			SMTP_PORT: process.env.SMTP_PORT,
			SMTP_USER: process.env.SMTP_USER,
			SMTP_PASSWORD: process.env.SMTP_PASSWORD,
			SMTP_EMAIL_FROM: process.env.SMTP_EMAIL_FROM,
			LOCALE_DATE_TIME: process.env.LOCALE_DATE_TIME,
			DATABASE_URL: process.env.DATABASE_URL,
			DATABASE_HOST: process.env.DATABASE_HOST,
			DATABASE_USERNAME: process.env.DATABASE_USERNAME,
			DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
			DATABASE_NAME: process.env.DATABASE_NAME,
			STRIPE_SK_TEST: process.env.STRIPE_SK_TEST,
			GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
			GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
			GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
			GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
			NOOB_API_REQUESTS_PER_DAY: Number(process.env.NOOB_API_REQUESTS_PER_DAY),
			CASUAL_API_REQUESTS_PER_DAY: Number(process.env.CASUAL_API_REQUESTS_PER_DAY),
			PRO_API_REQUESTS_PER_DAY: Number(process.env.PRO_API_REQUESTS_PER_DAY),
		};

		const validationResult = envsLocalValidator.safeParse(envLocalVariables);

		if (!validationResult.success) {
			console.error(
				"\n\nERROR: Alguma variável de ambiente LOCAL esta faltando ou setada incorretamente: ",
				validationResult.error.format(),
			);
			process.exit(1);
		}
	} else if (process.env.NODE_ENV === "production") {
		const envProductionVariables = {
			NODE_ENV: process.env.NODE_ENV,
			SERVER_PORT: Number(process.env.SERVER_PORT),
			API_KEY_ADMIN: process.env.API_KEY_ADMIN,
			USE_JSON_DATABASE: process.env.USE_JSON_DATABASE,
			LOG_PRISMA_QUERIES: process.env.LOG_PRISMA_QUERIES,
			ENABLE_TELEGRAM_LOGS: process.env.ENABLE_TELEGRAM_LOGS,
			APP_FRONT_URL_DEV: process.env.APP_FRONT_URL_DEV,
			APP_FRONT_URL_PROD: process.env.APP_FRONT_URL_PROD,
			JWT_SECRET: process.env.JWT_SECRET,
			TELEGRAM_BOT_HTTP_TOKEN: process.env.TELEGRAM_BOT_HTTP_TOKEN,
			TELEGRAM_BOT_CHANNEL_ID: process.env.TELEGRAM_BOT_CHANNEL_ID,
			SMTP_HOST: process.env.SMTP_HOST,
			SMTP_PORT: process.env.SMTP_PORT,
			SMTP_USER: process.env.SMTP_USER,
			SMTP_PASSWORD: process.env.SMTP_PASSWORD,
			SMTP_EMAIL_FROM: process.env.SMTP_EMAIL_FROM,
			LOCALE_DATE_TIME: process.env.LOCALE_DATE_TIME,
			DATABASE_URL: process.env.DATABASE_URL,
			DATABASE_HOST: process.env.DATABASE_HOST,
			DATABASE_USERNAME: process.env.DATABASE_USERNAME,
			DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
			DATABASE_NAME: process.env.DATABASE_NAME,
			STRIPE_SK_TEST: process.env.STRIPE_SK_TEST,
			GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
			GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
			GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
			GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
			NOOB_API_REQUESTS_PER_DAY: Number(process.env.NOOB_API_REQUESTS_PER_DAY),
			CASUAL_API_REQUESTS_PER_DAY: Number(process.env.CASUAL_API_REQUESTS_PER_DAY),
			PRO_API_REQUESTS_PER_DAY: Number(process.env.PRO_API_REQUESTS_PER_DAY),
		};

		const validationResult = envsProductionValidator.safeParse(envProductionVariables);

		if (!validationResult.success) {
			console.error(
				"\n\nERROR: Alguma variável de ambiente PRODUCTION esta faltando ou setada incorretamente: ",
				validationResult.error.format(),
			);
			process.exit(1);
		}
	}
}
