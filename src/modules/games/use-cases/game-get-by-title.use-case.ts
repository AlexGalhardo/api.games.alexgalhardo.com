import { Game, GamesRepositoryPort } from "../../../repositories/games.repository";
import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { ErrorsMessages } from "../../../utils/errors-messages.util";

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
	constructor(
		private readonly gamesRepository: GamesRepositoryPort,
		private readonly usersRepository: UsersRepositoryPort,
	) {}

	private async returnGamesByTitle(gameTitle: string, api_requests_today?: number) {
		const gameByTitle = await this.gamesRepository.getByTitle(gameTitle);
		if (gameByTitle) return { success: true, api_requests_today, data: gameByTitle };
		throw new Error(ErrorsMessages.GET_GAME_BY_TITLE_ERROR);
	}

	async execute(gameTitle: string, userAPIKey: string): Promise<GameGetByTitleUseCaseResponse> {
		if (!userAPIKey) throw new Error(ErrorsMessages.INVALID_API_KEY);

		if (userAPIKey === process.env.API_KEY_ADMIN) {
			return this.returnGamesByTitle(gameTitle);
		} else {
			const { success, found_api_key, api_requests_today } =
				await this.usersRepository.incrementAPIRequest(userAPIKey);

			if (success && found_api_key) {
				return this.returnGamesByTitle(gameTitle, api_requests_today);
			} else if (!success && found_api_key) {
				return { success, error: "Your API Requests reached limit for today", api_requests_today };
			} else {
				return { success, error: ErrorsMessages.API_KEY_NOT_FOUND };
			}
		}
	}
}
