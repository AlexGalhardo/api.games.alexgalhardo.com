import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { ErrorsMessages } from "../../../utils/errors-messages.util";

interface ProfileDeleteUseCaseResponse {
	success: boolean;
	jwt_token?: string;
}

export interface ProfileDeleteUseCasePort {
	execute(email: string): Promise<ProfileDeleteUseCaseResponse>;
}

export default class ProfileDeleteUseCase implements ProfileDeleteUseCasePort {
	constructor(private readonly usersRepository: UsersRepositoryPort) {}

	async execute(email: string): Promise<ProfileDeleteUseCaseResponse> {
		if (this.usersRepository.findByEmail(email)) {
			await this.usersRepository.deleteByEmail(email);
			return { success: true };
		}

		throw new Error(ErrorsMessages.USER_NOT_FOUND);
	}
}
