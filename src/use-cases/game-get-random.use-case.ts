import { Game, GamesRepositoryPort } from "../repositories/games.repository";
import { UsersRepositoryPort } from "../repositories/users.repository";
import { ErrorsMessages } from "../utils/errors-messages.util";
import { ClientException } from "../utils/exceptions.util";

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
    constructor(
        private readonly gamesRepository: GamesRepositoryPort,
        private readonly usersRepository: UsersRepositoryPort,
    ) {}

    private async returnRandomGame(api_requests_today?: number) {
        const randomGame = await this.gamesRepository.getRandom();
        if (randomGame) return { success: true, data: randomGame, api_requests_today };
        throw new ClientException(ErrorsMessages.GET_RANDOM_GAME_ERROR);
    }

    async execute(userAPIKey: string): Promise<GameGetRandomUseCaseResponse> {
        if (!userAPIKey) throw new ClientException(ErrorsMessages.INVALID_API_KEY);

        if (userAPIKey === process.env.API_KEY_ADMIN) {
            return this.returnRandomGame();
        } else {
            const { success, found_api_key, api_requests_today } =
                await this.usersRepository.incrementAPIRequest(userAPIKey);

            if (success && found_api_key) {
                return this.returnRandomGame(api_requests_today);
            } else if (!success && found_api_key) {
                return { success, error: "Your API Requests reached limit for today", api_requests_today };
            } else {
                return { success, error: ErrorsMessages.API_KEY_NOT_FOUND };
            }
        }
    }
}
