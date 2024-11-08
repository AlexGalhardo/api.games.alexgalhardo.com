import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { ErrorsMessages } from "../../../utils/errors-messages.util";

export interface AuthLogoutUseCasePort {
	execute(userId: string): Promise<AuthLogoutUseCaseResponse>;
}

interface AuthLogoutUseCaseResponse {
	success: boolean;
}

export default class AuthLogoutUseCase implements AuthLogoutUseCasePort {
	constructor(private readonly usersRepository: UsersRepositoryPort) {}

	async execute(userId: string): Promise<AuthLogoutUseCaseResponse> {
		if (userId && (await this.usersRepository.findById(userId))) {
			await this.usersRepository.logout(userId);
			return { success: true };
		}

		throw new Error(ErrorsMessages.HEADER_AUTHORIZATION_BEARER_TOKEN_EXPIRED_OR_INVALID);
	}
}
