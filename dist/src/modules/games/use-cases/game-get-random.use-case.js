"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
class GameGetRandomUseCase {
    constructor(gamesRepository, usersRepository) {
        this.gamesRepository = gamesRepository;
        this.usersRepository = usersRepository;
    }
    async returnRandomGame(api_requests_today) {
        const randomGame = await this.gamesRepository.getRandom();
        if (randomGame)
            return { success: true, data: randomGame, api_requests_today };
        throw new Error(errors_messages_util_1.ErrorsMessages.GET_RANDOM_GAME_ERROR);
    }
    async execute(userAPIKey) {
        if (!userAPIKey)
            throw new Error(errors_messages_util_1.ErrorsMessages.INVALID_API_KEY);
        if (userAPIKey === process.env.API_KEY_ADMIN) {
            return this.returnRandomGame();
        }
        else {
            const { success, found_api_key, api_requests_today } = await this.usersRepository.incrementAPIRequest(userAPIKey);
            if (success && found_api_key) {
                return this.returnRandomGame(api_requests_today);
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
exports.default = GameGetRandomUseCase;
//# sourceMappingURL=game-get-random.use-case.js.map