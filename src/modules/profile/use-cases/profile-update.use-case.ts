import { ProfileUpdateValidator } from "src/validators/profile-update.validator";
import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { ErrorsMessages } from "../../../utils/errors-messages.util";
import { ProfileUpdateDTO } from "src/modules/profile/dtos/profile-update.dto";
import { User } from "@prisma/client";

interface ProfileUpdateUseCaseResponse {
	success: boolean;
	data?: any;
	error?: string;
}

export interface ProfileUpdateUseCasePort {
	execute(userId: string, profileUpdatePayload: ProfileUpdateDTO): Promise<ProfileUpdateUseCaseResponse>;
}

export default class ProfileUpdateUseCase implements ProfileUpdateUseCasePort {
	constructor(private readonly usersRepository: UsersRepositoryPort) {}

	async execute(userId: string, payload: ProfileUpdateDTO): Promise<ProfileUpdateUseCaseResponse> {
		ProfileUpdateValidator.parse(payload);

		const { new_password, confirm_new_password } = payload;

		const user = await this.usersRepository.findById(userId);

		if (!user) return { success: false, error: ErrorsMessages.USER_NOT_FOUND };

		if (user && new_password === confirm_new_password) {
			const userUpdated = await this.usersRepository.update(userId, payload);
			return { success: true, data: userUpdated };
		}

		return { success: false, error: "new_password and confirm_new_password are not equal" };
	}
}
