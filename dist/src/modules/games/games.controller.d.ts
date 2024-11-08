import { Response } from "express";
import { GamesResponse } from "src/modules/games/dtos/game-response.swagger";
import { GameGetRandomUseCasePort } from "./use-cases/game-get-random.use-case";
import { GameGetByIdUseCasePort } from "./use-cases/game-get-by-id.use-case";
import { GameGetByTitleUseCasePort } from "./use-cases/game-get-by-title.use-case";
interface GamesControllerPort {
    getRandom(response: Response): Promise<Response<GamesResponse>>;
    findById(game_id: string, response: Response): Promise<Response<GamesResponse>>;
    getByTitle(game_title: string, response: Response): Promise<Response<GamesResponse>>;
}
export declare class GamesController implements GamesControllerPort {
    private readonly gameGetRandomUseCase;
    private readonly gameGetByIdUseCase;
    private readonly gameGetByTitleUseCase;
    constructor(gameGetRandomUseCase: GameGetRandomUseCasePort, gameGetByIdUseCase: GameGetByIdUseCasePort, gameGetByTitleUseCase: GameGetByTitleUseCasePort);
    getRandom(response: Response): Promise<Response<GamesResponse>>;
    findById(game_id: string, response: Response): Promise<Response<GamesResponse>>;
    getByTitle(game_title: string, response: Response): Promise<Response<GamesResponse>>;
}
export {};
