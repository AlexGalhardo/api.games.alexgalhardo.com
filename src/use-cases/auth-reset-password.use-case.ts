import AuthResetPasswordValidator from "src/validators/auth-reset-password.validator";
import { UsersRepositoryPort } from "../repositories/users.repository";
import { Bcrypt } from "../utils/bcrypt.util";
import { ErrorsMessages } from "../utils/errors-messages.util";

export interface AuthResetPasswordUseCasePort {
	execute(
		resetPasswordToken: string,
		authResetPasswordDTO: AuthResetPasswordDTO,
	): Promise<AuthResetPasswordUseCaseResponse>;
}

export interface AuthResetPasswordDTO {
	newPassword: string;
	confirmNewPassword: string;
}

interface AuthResetPasswordUseCaseResponse {
	success: boolean;
}

export default class AuthResetPasswordUseCase implements AuthResetPasswordUseCasePort {
	constructor(private readonly usersRepository: UsersRepositoryPort) { }

	async execute(
		resetPasswordToken: string,
		authResetPasswordDTO: AuthResetPasswordDTO,
	): Promise<AuthResetPasswordUseCaseResponse> {
		AuthResetPasswordValidator.parse(authResetPasswordDTO)

		const { user } = await this.usersRepository.findByResetPasswordToken(resetPasswordToken);

		if (user) {
			const { newPassword } = authResetPasswordDTO;

			const hashedPassword = await Bcrypt.hash(newPassword);

			await this.usersRepository.resetPassword(user.id, hashedPassword);

			return { success: true };
		}

		throw new Error(ErrorsMessages.RESET_PASSWORD_TOKEN_INVALID);
	}
}
