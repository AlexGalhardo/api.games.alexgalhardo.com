"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
class GameGetByIdUseCase {
    constructor(gamesRepository, usersRepository) {
        this.gamesRepository = gamesRepository;
        this.usersRepository = usersRepository;
    }
    async returnGameById(gameId, api_requests_today) {
        const gameById = await this.gamesRepository.findById(gameId);
        if (gameById)
            return { success: true, api_requests_today, data: gameById };
        throw new Error(errors_messages_util_1.ErrorsMessages.GET_GAME_BY_ID_ERROR);
    }
    async execute(gameId, userAPIKey) {
        if (!userAPIKey)
            throw new Error(errors_messages_util_1.ErrorsMessages.INVALID_API_KEY);
        if (userAPIKey === process.env.API_KEY_ADMIN) {
            return this.returnGameById(gameId);
        }
        else {
            const { success, found_api_key, api_requests_today } = await this.usersRepository.incrementAPIRequest(userAPIKey);
            if (success && found_api_key) {
                return this.returnGameById(gameId, api_requests_today);
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
exports.default = GameGetByIdUseCase;
//# sourceMappingURL=game-get-by-id.use-case.js.map