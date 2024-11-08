import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { LOG_PRISMA_QUERIES } from "src/utils/constants.util";

@Injectable()
export class Database extends PrismaClient implements OnModuleInit {
	constructor() {
		if (LOG_PRISMA_QUERIES) {
			super({
				log: ["query", "info", "warn", "error"],
				errorFormat: "minimal",
			});
		} else {
			super();
		}
	}

	async onModuleInit() {
		await this.$connect();
	}

	async enableShutdownHooks(app: INestApplication) {
		process.on("beforeExit", async () => {
			await app.close();
		});
	}
}
