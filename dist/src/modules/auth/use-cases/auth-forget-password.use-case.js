"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_util_1 = require("../../../utils/constants.util");
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
const generate_random_token_util_1 = require("../../../utils/generate-random-token.util");
const smtp_config_1 = require("../../../config/smtp.config");
const email_validator_1 = require("../../../validators/email.validator");
class AuthForgetPasswordUseCase {
    constructor(usersRepository, smtp = smtp_config_1.SMTP) {
        this.usersRepository = usersRepository;
        this.smtp = smtp;
    }
    async execute(authForgetPasswordDTO) {
        const { email } = authForgetPasswordDTO;
        if (!email_validator_1.default.validate(email))
            throw new Error(errors_messages_util_1.ErrorsMessages.EMAIL_INVALID);
        const { user } = await this.usersRepository.findByEmail(email);
        if (user) {
            const reset_password_token = (0, generate_random_token_util_1.default)();
            await this.usersRepository.saveResetPasswordToken(user.id, reset_password_token);
            const resetPasswordLink = `${constants_util_1.FRONT_END_URL}/reset-password/${reset_password_token}`;
            const sendEmailForgetPasswordResponse = await this.smtp.sendMail({
                from: process.env.SMTP_EMAIL_FROM,
                to: "aleexgvieira@gmail.com",
                subject: `NerdAPI: Forget Password Link To ${email}`,
                html: `
					<p>Hello ${user.name},</p>
					<p>To recover your password, click on this link do reset your password: </p>
					<p><strong>${resetPasswordLink}</strong></p>
					<hr>
					<p>NerdAPI</p>
				`,
            });
            if (sendEmailForgetPasswordResponse) {
                return { success: true, reset_password_token };
            }
            else {
                throw new Error(errors_messages_util_1.ErrorsMessages.EMAIL_FORGET_PASSWORD_NOT_SEND);
            }
        }
        throw new Error(errors_messages_util_1.ErrorsMessages.USER_NOT_FOUND);
    }
}
exports.default = AuthForgetPasswordUseCase;
//# sourceMappingURL=auth-forget-password.use-case.js.map