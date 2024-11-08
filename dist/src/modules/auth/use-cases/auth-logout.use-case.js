"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
const jwt = require("jsonwebtoken");
class AuthLogoutUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(jwtToken) {
        const { userID } = jwt.verify(jwtToken, process.env.JWT_SECRET);
        if (userID && (await this.usersRepository.findById(userID))) {
            await this.usersRepository.logout(userID);
            return { success: true };
        }
        throw new Error(errors_messages_util_1.ErrorsMessages.HEADER_AUTHORIZATION_BEARER_TOKEN_EXPIRED_OR_INVALID);
    }
}
exports.default = AuthLogoutUseCase;
//# sourceMappingURL=auth-logout.use-case.js.map