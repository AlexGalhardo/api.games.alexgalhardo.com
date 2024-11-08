import { Controller, Res, HttpStatus, Get, Inject } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { HealthCheckResponse } from "./dtos/health-check.swagger";
import { GamesRepositoryPort } from "src/repositories/games.repository";

@Controller()
@ApiTags("health-check")
export class HealthCheckController {
	constructor(@Inject("GamesRepositoryPort") private readonly gamesRepository: GamesRepositoryPort) {}

	@Get("/")
	@ApiResponse({ status: 200, type: HealthCheckResponse })
	async index(@Res() response: Response) {
		// const memoryUsage = process.memoryUsage();
		// const uptime = process.uptime();
		// let databaseStatus = "unhealthy";

		// try {
		// 	const randomGame = await this.gamesRepository.getRandom();
		// 	if (randomGame) databaseStatus = "healthy";
		// } catch (error) {
		// 	return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
		// 		success: false,
		// 		message: "Unable to connect to the database",
		// 		error: error?.message,
		// 	});
		// }

		return response.status(HttpStatus.OK).json({
			success: true,
			swagger: `/docs`,
			// health: {
			// 	database: databaseStatus,
			// 	uptime: `${Math.floor(uptime / 60)} minutes`,
			// 	memoryUsage: {
			// 		rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
			// 		heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
			// 		heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
			// 		external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
			// 	},
			// },
		});
	}
}
