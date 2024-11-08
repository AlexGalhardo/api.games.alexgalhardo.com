"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_util_1 = require("../../../utils/bcrypt.util");
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
const password_validator_1 = require("../../../validators/password.validator");
class AuthResetPasswordUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(resetPasswordToken, authResetPasswordDTO) {
        const { newPassword, confirmNewPassword } = authResetPasswordDTO;
        if (!password_validator_1.default.isEqual(newPassword, confirmNewPassword))
            throw new Error(errors_messages_util_1.ErrorsMessages.PASSWORDS_NOT_EQUAL);
        const { user } = await this.usersRepository.findByResetPasswordToken(resetPasswordToken);
        if (user) {
            const hashedPassword = await bcrypt_util_1.Bcrypt.hash(newPassword);
            await this.usersRepository.resetPassword(user.id, hashedPassword);
            return { success: true };
        }
        throw new Error(errors_messages_util_1.ErrorsMessages.RESET_PASSWORD_TOKEN_INVALID);
    }
}
exports.default = AuthResetPasswordUseCase;
//# sourceMappingURL=auth-reset-password.use-case.js.map