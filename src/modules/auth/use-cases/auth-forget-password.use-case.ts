import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { FRONT_END_URL } from "../../../utils/constants.util";
import { ErrorsMessages } from "../../../utils/errors-messages.util";
import GenerateRandomToken from "../../../utils/generate-random-token.util";
import { SMTP } from "../../../config/smtp.config";
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

	async execute(payload: AuthForgetPasswordDTO): Promise<AuthForgetPasswordUseCaseResponse> {
		const { email } = payload;

		z.string().email().parse(payload.email);

		const user = await this.usersRepository.findByEmail(email);

		if (user) {
			const reset_password_token = GenerateRandomToken();

			await this.usersRepository.saveResetPasswordToken(user.id, reset_password_token);

			const resetPasswordLink = `${FRONT_END_URL}/reset-password/${reset_password_token}`;

			const sendEmailForgetPasswordResponse = await this.smtp.sendMail({
				from: process.env.SMTP_EMAIL_FROM,
				to: "aleexgvieira@gmail.com", // email
				subject: `Games: Forget Password Link`,
				html: `
					<p>Hello ${user.name},</p>
					<p>To recover your password, click on this link do reset your password: </p>
					<p><strong>${resetPasswordLink}</strong></p>
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
