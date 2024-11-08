import { Controller, Res, HttpStatus, Get, Inject, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import TelegramLog from "src/config/telegram-logger.config";
import { GamesResponse } from "src/modules/games/dtos/game-response.swagger";
import { GameGetRandomUseCasePort } from "./use-cases/game-get-random.use-case";
import { GameGetByIdUseCasePort } from "./use-cases/game-get-by-id.use-case";
import { GameGetByTitleUseCasePort } from "./use-cases/game-get-by-title.use-case";

interface GamesControllerPort {
	getRandom(response: Response): Promise<Response<GamesResponse>>;
	findById(game_id: string, response: Response): Promise<Response<GamesResponse>>;
	getByTitle(game_title: string, response: Response): Promise<Response<GamesResponse>>;
}

@Controller("games")
@ApiTags("games")
export class GamesController implements GamesControllerPort {
	constructor(
		@Inject("GameGetRandomUseCasePort") private readonly gameGetRandomUseCase: GameGetRandomUseCasePort,
		@Inject("GameGetByIdUseCasePort") private readonly gameGetByIdUseCase: GameGetByIdUseCasePort,
		@Inject("GameGetByTitleUseCasePort") private readonly gameGetByTitleUseCase: GameGetByTitleUseCasePort,
	) {}

	@Get("/random")
	@ApiBearerAuth()
	@ApiResponse({ status: 200, description: "Get random game", type: GamesResponse })
	async getRandom(@Res() response: Response): Promise<Response<GamesResponse>> {
		try {
			const userAPIKey = response.locals.token;
			const { success, data, error, api_requests_today } = await this.gameGetRandomUseCase.execute(userAPIKey);
			if (success) return response.status(HttpStatus.OK).json({ success: true, api_requests_today, data });
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error, api_requests_today });
		} catch (error: any) {
			TelegramLog.error(`ERROR Game get random: ${error.message}`);
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
		}
	}

	@Get("/id/:game_id")
	@ApiBearerAuth()
	@ApiParam({
		name: "game_id",
		description: "Reset password token",
		example: "d7e4596d-748d-4050-904f-aaed7863f687",
		required: true,
		type: String,
	})
	@ApiResponse({ status: 200, description: "Get game by id", type: GamesResponse })
	async findById(@Param("game_id") game_id: string, @Res() response: Response): Promise<Response<GamesResponse>> {
		try {
			const userAPIKey = response.locals.token;
			const { success, data, error, api_requests_today } = await this.gameGetByIdUseCase.execute(
				game_id,
				userAPIKey,
			);
			if (success) return response.status(HttpStatus.OK).json({ success: true, api_requests_today, data });
			return response.status(HttpStatus.OK).json({ success: false, api_requests_today, error });
		} catch (error: any) {
			TelegramLog.error(`ERROR Game get by id: ${error.message}`);
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
		}
	}

	@Get("/title/:game_title")
	@ApiBearerAuth()
	@ApiParam({
		name: "game_title",
		description: "Reset password token",
		example: "God Of War",
		required: true,
		type: String,
	})
	@ApiResponse({ status: 200, description: "Get game by title", type: GamesResponse })
	async getByTitle(
		@Param("game_title") game_title: string,
		@Res() response: Response,
	): Promise<Response<GamesResponse>> {
		try {
			const userAPIKey = response.locals.token;
			const { success, data, error, api_requests_today } = await this.gameGetByTitleUseCase.execute(
				game_title,
				userAPIKey,
			);
			if (success) return response.status(HttpStatus.OK).json({ success: true, api_requests_today, data });
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false, api_requests_today, error });
		} catch (error: any) {
			TelegramLog.error(`ERROR Game get by title: ${error.message}`);
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
		}
	}
}
