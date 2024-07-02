import { Controller, Res, HttpStatus, Get, Inject, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { GameEntity } from "../entities/game.entity";
import { Game } from "../repositories/games.repository";
import { GameGetByIdUseCasePort } from "../use-cases/game-get-by-id.use-case";
import { GameGetByTitleUseCasePort } from "../use-cases/game-get-by-title.use-case";
import { GameGetRandomUseCasePort } from "../use-cases/game-get-random.use-case";

interface GameUseCaseResponse {
	success: boolean;
	error?: string;
	data?: Game | Game[];
	api_requests_today?: number;
}

interface GamesControllerPort {
	getRandom(req: any, reply): Promise<Response<GameUseCaseResponse>>;
	findById(req: any, reply): Promise<Response<GameUseCaseResponse>>;
	getByTitle(req: any, reply): Promise<Response<GameUseCaseResponse>>;
}

@Controller("games")
@ApiTags("games")
export class GamesController implements GamesControllerPort {
	constructor(
		@Inject("GameGetRandomUseCasePort") private readonly gameGetRandomUseCase: GameGetRandomUseCasePort,
		@Inject("GameGetByIdUseCasePort") private readonly gameGetByIdUseCase: GameGetByIdUseCasePort,
		@Inject("GameGetByTitleUseCasePort") private readonly gameGetByTitleUseCase: GameGetByTitleUseCasePort,
	) { }

	@Get("/random")
	@ApiBearerAuth()
	@ApiResponse({ status: 200, description: "Use api_key_admin in Authorize", type: GameEntity })
	async getRandom(@Req req: Request, @Res reply: Response): Promise<Response<GameUseCaseResponse>> {
		try {
			const userAPIKey = req.headers['token'];
			console.log("userAPIKey => ", userAPIKey)
			const { success, data, error, api_requests_today } = await this.gameGetRandomUseCase.execute(userAPIKey);
			if (success) return reply.status(HttpStatus.OK).send({ success: true, api_requests_today, data });
			return reply.status(HttpStatus.OK).send({ success: false, error, api_requests_today });
		} catch (error: any) {
			return reply.send({ success: false, error: error.issues ?? error.message });
		}
	}

	@Get("/id/:game_id")
	async findById(@Req() request: Request, @Res() response: Response): Promise<Response<GameUseCaseResponse>> {
		try {
			const { game_id } = request.params;
			const userAPIKey = response.locals.token;
			const { success, data, error, api_requests_today } = await this.gameGetByIdUseCase.execute(
				game_id,
				userAPIKey,
			);
			if (success) return response.status(HttpStatus.OK).send({ success: true, api_requests_today, data });
			return response.status(HttpStatus.OK).send({ success: false, api_requests_today, error });
		} catch (error: any) {
			return response.status(HttpStatus.BAD_REQUEST).send({ success: false, error: error.issues ?? error.message });
		}
	}

	@Get("/title/:game_title")
	async getByTitle(@Req() request: Request, @Res() response: Response): Promise<Response<GameUseCaseResponse>> {
		try {
			const { game_title } = request.params;
			const userAPIKey = response.locals.token;
			const { success, data, error, api_requests_today } = await this.gameGetByTitleUseCase.execute(
				game_title,
				userAPIKey,
			);
			if (success) return response.status(HttpStatus.OK).send({ success: true, api_requests_today, data });
			return response.status(HttpStatus.OK).send({ success: false, api_requests_today, error });
		} catch (error: any) {
			return response.status(HttpStatus.BAD_REQUEST).send({ success: false, error: error.issues ?? error.message });
		}
	}
}
