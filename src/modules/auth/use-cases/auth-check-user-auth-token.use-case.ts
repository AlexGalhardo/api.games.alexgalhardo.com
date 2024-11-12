import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { ErrorsMessages } from "../../../utils/errors-messages.util";
import { User } from "@prisma/client";

export interface AuthCheckUserAuthTokenUseCasePort {
	execute(token: string): Promise<AuthCheckUserAuthTokenUseCaseResponse>;
}

interface AuthCheckUserAuthTokenUseCaseResponse {
	success: boolean;
	data: User;
}

export default class AuthCheckUserAuthTokenUseCase implements AuthCheckUserAuthTokenUseCasePort {
	constructor(private readonly usersRepository: UsersRepositoryPort) {}

	async execute(userId: string): Promise<AuthCheckUserAuthTokenUseCaseResponse> {
		if (userId && (await this.usersRepository.findById(userId))) {
			const user = await this.usersRepository.findById(userId);
			return { success: true, data: user };
		}

		throw new Error(ErrorsMessages.USER_NOT_FOUND);
	}
}
