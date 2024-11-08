"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
class GameGetByTitleUseCase {
    constructor(gamesRepository, usersRepository) {
        this.gamesRepository = gamesRepository;
        this.usersRepository = usersRepository;
    }
    async returnGamesByTitle(gameTitle, api_requests_today) {
        const gameByTitle = await this.gamesRepository.getByTitle(gameTitle);
        if (gameByTitle)
            return { success: true, api_requests_today, data: gameByTitle };
        throw new Error(errors_messages_util_1.ErrorsMessages.GET_GAME_BY_TITLE_ERROR);
    }
    async execute(gameTitle, userAPIKey) {
        if (!userAPIKey)
            throw new Error(errors_messages_util_1.ErrorsMessages.INVALID_API_KEY);
        if (userAPIKey === process.env.API_KEY_ADMIN) {
            return this.returnGamesByTitle(gameTitle);
        }
        else {
            const { success, found_api_key, api_requests_today } = await this.usersRepository.incrementAPIRequest(userAPIKey);
            if (success && found_api_key) {
                return this.returnGamesByTitle(gameTitle, api_requests_today);
            }
            else if (!success && found_api_key) {
                return { success, error: "Your API Requests reached limit for today", api_requests_today };
            }
            else {
                return { success, error: errors_messages_util_1.ErrorsMessages.API_KEY_NOT_FOUND };
            }
        }
    }
}
exports.default = GameGetByTitleUseCase;
//# sourceMappingURL=game-get-by-title.use-case.js.map