"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
const jwt = require("jsonwebtoken");
class AuthCheckUserJWTTokenUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(token) {
        const { userID } = jwt.verify(token, process.env.JWT_SECRET);
        if (userID && (await this.usersRepository.findById(userID))) {
            const { user } = await this.usersRepository.findById(userID);
            return { success: true, data: user };
        }
        throw new Error(errors_messages_util_1.ErrorsMessages.USER_NOT_FOUND);
    }
}
exports.default = AuthCheckUserJWTTokenUseCase;
//# sourceMappingURL=auth-check-user-jwt-token.use-case.js.map