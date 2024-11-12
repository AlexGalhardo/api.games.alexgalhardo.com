import { Module } from "@nestjs/common";
import { HealthCheckController } from "./health-check.controller";
import { Database } from "src/config/database.config";
import GamesRepository from "src/repositories/games.repository";

@Module({
	controllers: [HealthCheckController],
	providers: [
		Object,
		Database,
		{
			provide: "GamesRepositoryPort",
			inject: [Database],
			useFactory: (database: Database) => {
				return new GamesRepository(database);
			},
		},
	],
})
export class HealthCheckModule {}
