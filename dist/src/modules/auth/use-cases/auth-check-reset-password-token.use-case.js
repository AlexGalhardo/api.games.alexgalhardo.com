"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
class AuthCheckResetPasswordTokenUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(resetPasswordToken) {
        const resetPasswordTokenExist = await this.usersRepository.findResetPasswordToken(resetPasswordToken);
        if (resetPasswordTokenExist)
            return { success: true };
        throw new Error(errors_messages_util_1.ErrorsMessages.RESET_PASSWORD_TOKEN_INVALID);
    }
}
exports.default = AuthCheckResetPasswordTokenUseCase;
//# sourceMappingURL=auth-check-reset-password-token.use-case.js.map