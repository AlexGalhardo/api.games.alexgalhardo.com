"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_util_1 = require("../../../utils/bcrypt.util");
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
const jwt = require("jsonwebtoken");
const email_validator_1 = require("../../../validators/email.validator");
const password_validator_1 = require("../../../validators/password.validator");
class AuthLoginUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(authLoginPayload) {
        const { email, password } = authLoginPayload;
        if (email && !email_validator_1.default.validate(email))
            throw new Error(errors_messages_util_1.ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);
        if (password && !password_validator_1.default.validate(password))
            throw new Error(errors_messages_util_1.ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);
        if (email && password) {
            const { user, index } = await this.usersRepository.findByEmail(email);
            if (user) {
                if (!(await bcrypt_util_1.Bcrypt.compare(password, user.password))) {
                    return { success: false, message: errors_messages_util_1.ErrorsMessages.EMAIL_OR_PASSWORD_INVALID };
                }
                const jwt_token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET);
                user.jwt_token = jwt_token;
                await this.usersRepository.save(user, index);
                return { success: true, jwt_token };
            }
            throw new Error(errors_messages_util_1.ErrorsMessages.USER_NOT_FOUND);
        }
        throw new Error(errors_messages_util_1.ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);
    }
}
exports.default = AuthLoginUseCase;
//# sourceMappingURL=auth-login.use-case.js.map