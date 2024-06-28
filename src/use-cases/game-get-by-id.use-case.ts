import { Game, GamesRepositoryPort } from "../repositories/games.repository";
import { UsersRepositoryPort } from "../repositories/users.repository";
import { ErrorsMessages } from "../utils/errors-messages.util";
import { Error } from "../utils/exceptions.util";

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
    constructor(
        private readonly gamesRepository: GamesRepositoryPort,
        private readonly usersRepository: UsersRepositoryPort,
    ) {}

    private async returnGameById(gameId: string, api_requests_today?: number) {
        const gameById = await this.gamesRepository.findById(gameId);
        if (gameById) return { success: true, api_requests_today, data: gameById };
        throw new Error(ErrorsMessages.GET_GAME_BY_ID_ERROR);
    }

    async execute(gameId: string, userAPIKey: string): Promise<GameGetByIdUseCaseResponse> {
        if (!userAPIKey) throw new Error(ErrorsMessages.INVALID_API_KEY);

        if (userAPIKey === process.env.API_KEY_ADMIN) {
            return this.returnGameById(gameId);
        } else {
            const { success, found_api_key, api_requests_today } =
                await this.usersRepository.incrementAPIRequest(userAPIKey);

            if (success && found_api_key) {
                return this.returnGameById(gameId, api_requests_today);
            } else if (!success && found_api_key) {
                return { success, error: "Your API Requests reached limit for today", api_requests_today };
            } else {
                return { success, error: ErrorsMessages.API_KEY_NOT_FOUND };
            }
        }
    }
}
