import { Game, GamesRepositoryPort } from "../../../repositories/games.repository";
import { UsersRepositoryPort } from "../../../repositories/users.repository";
export interface GameGetByIdUseCasePort {
    execute(gameId: string, userAPIKey: string): Promise<GameGetByIdUseCaseResponse>;
}
interface GameGetByIdUseCaseResponse {
    success: boolean;
    data?: Game;
    error?: string;
    api_requests_today?: number;
}
export default class GameGetByIdUseCase implements GameGetByIdUseCasePort {
    private readonly gamesRepository;
    private readonly usersRepository;
    constructor(gamesRepository: GamesRepositoryPort, usersRepository: UsersRepositoryPort);
    private returnGameById;
    execute(gameId: string, userAPIKey: string): Promise<GameGetByIdUseCaseResponse>;
}
export {};
