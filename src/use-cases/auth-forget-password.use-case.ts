import { UsersRepositoryPort } from "../repositories/users.repository";
import { APP_URL } from "../utils/constants.util";
import { ErrorsMessages } from "../utils/errors-messages.util";
import GenerateRandomToken from "../utils/generate-random-token.util";
import { SMTP } from "../config/smtp.config";
import { z } from "zod";

export interface AuthForgetPasswordUseCasePort {
    execute(authForgetPasswordDTO: AuthForgetPasswordDTO): Promise<AuthForgetPasswordUseCaseResponse>;
}

export interface AuthForgetPasswordDTO {
    email: string;
}

interface AuthForgetPasswordUseCaseResponse {
    success: boolean;
    reset_password_token?: string;
}

export default class AuthForgetPasswordUseCase implements AuthForgetPasswordUseCasePort {
    constructor(
        private readonly usersRepository: UsersRepositoryPort,
        private readonly smtp = SMTP,
    ) {}

    async execute(authForgetPasswordDTO: AuthForgetPasswordDTO): Promise<AuthForgetPasswordUseCaseResponse> {
        z.object({ email: z.string().email() }).parse(authForgetPasswordDTO);

        const { email } = authForgetPasswordDTO;

        const { user } = await this.usersRepository.findByEmail(email);

        if (user) {
            const reset_password_token = GenerateRandomToken();

            await this.usersRepository.saveResetPasswordToken(user.id, reset_password_token);

            const resetPasswordLink = `${APP_URL}/reset-password/${reset_password_token}`;

            const sendEmailForgetPasswordResponse = await this.smtp.sendMail({
                from: process.env.SMTP_EMAIL_FROM,
                to: "aleexgvieira@gmail.com", // email
                subject: `NerdAPI: Forget Password Link To ${email}`,
                html: `
					<p>Hello ${user.username},</p>
					<p>To recover your password, click on this link do reset your password: </p>
					<p><strong>${resetPasswordLink}</strong></p>
					<hr>
					<p>NerdAPI</p>
				`,
            });

            if (sendEmailForgetPasswordResponse) {
                return { success: true, reset_password_token };
            } else {
                throw new Error(ErrorsMessages.EMAIL_FORGET_PASSWORD_NOT_SEND);
            }
        }

        throw new Error(ErrorsMessages.USER_NOT_FOUND);
    }
}
