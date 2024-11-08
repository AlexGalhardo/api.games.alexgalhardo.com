import { Game, GamesRepositoryPort } from "../../../repositories/games.repository";
import { UsersRepositoryPort } from "../../../repositories/users.repository";
export interface GameGetRandomUseCasePort {
    execute(userAPIKey: string): Promise<GameGetRandomUseCaseResponse>;
}
interface GameGetRandomUseCaseResponse {
    success: boolean;
    data?: Game;
    error?: string;
    api_requests_today?: number;
}
export default class GameGetRandomUseCase implements GameGetRandomUseCasePort {
    private readonly gamesRepository;
    private readonly usersRepository;
    constructor(gamesRepository: GamesRepositoryPort, usersRepository: UsersRepositoryPort);
    private returnRandomGame;
    execute(userAPIKey: string): Promise<GameGetRandomUseCaseResponse>;
}
export {};
