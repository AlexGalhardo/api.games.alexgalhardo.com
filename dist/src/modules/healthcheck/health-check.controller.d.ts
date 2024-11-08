import { Response } from "express";
import { GamesRepositoryPort } from "src/repositories/games.repository";
export declare class HealthCheckController {
    private readonly gamesRepository;
    constructor(gamesRepository: GamesRepositoryPort);
    index(response: Response): Promise<Response<any, Record<string, any>>>;
}
