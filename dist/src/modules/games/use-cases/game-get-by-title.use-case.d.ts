import { Game, GamesRepositoryPort } from "../../../repositories/games.repository";
import { UsersRepositoryPort } from "../../../repositories/users.repository";
export interface GameGetByTitleUseCasePort {
    execute(gameId: string, userAPIKey: string): Promise<GameGetByTitleUseCaseResponse>;
}
interface GameGetByTitleUseCaseResponse {
    success: boolean;
    data?: Game[];
    error?: string;
    api_requests_today?: number;
}
export default class GameGetByTitleUseCase implements GameGetByTitleUseCasePort {
    private readonly gamesRepository;
    private readonly usersRepository;
    constructor(gamesRepository: GamesRepositoryPort, usersRepository: UsersRepositoryPort);
    private returnGamesByTitle;
    execute(gameTitle: string, userAPIKey: string): Promise<GameGetByTitleUseCaseResponse>;
}
export {};
