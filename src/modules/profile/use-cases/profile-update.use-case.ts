import { UsersRepositoryPort, UserUpdated } from "../../../repositories/users.repository";
import { ErrorsMessages } from "../../../utils/errors-messages.util";
import * as jwt from "jsonwebtoken";
import { PhoneValidator } from "../../../validators/phone.validator";
import { PasswordValidator } from "../../../validators/password.validator";
import { UsernameValidator } from "../../../validators/username.validator";
import { ProfileUpdateBodyDTO } from "src/modules/profile/dtos/profile-update.swagger";

interface ProfileUpdateUseCaseResponse {
	success: boolean;
	data?: UserUpdated;
}

export interface ProfileUpdateUseCasePort {
	execute(user_id: string, profileUpdateDTO: ProfileUpdateBodyDTO): Promise<ProfileUpdateUseCaseResponse>;
}

export default class ProfileUpdateUseCase implements ProfileUpdateUseCasePort {
	constructor(private readonly usersRepository: UsersRepositoryPort) {}

	async execute(user_id: string, profileUpdateDTO: ProfileUpdateBodyDTO): Promise<ProfileUpdateUseCaseResponse> {
		const { user } = await this.usersRepository.findById(user_id);

		if (user) {
			if (profileUpdateDTO.name) {
				if (!UsernameValidator.validate(profileUpdateDTO.name)) {
					throw new Error(ErrorsMessages.USERNAME_INVALID);
				}
			}

			if (profileUpdateDTO.phone_number) {
				if (!PhoneValidator.validate(profileUpdateDTO.phone_number)) {
					throw new Error(ErrorsMessages.INVALID_PHONE_NUMBER);
				}

				if (await this.usersRepository.phoneAlreadyRegistred(user.id, profileUpdateDTO.phone_number)) {
					throw new Error(ErrorsMessages.PHONE_NUMBER_ALREADY_REGISTRED);
				}
			}

			if (profileUpdateDTO.newPassword && profileUpdateDTO.confirmNewPassword) {
				if (!PasswordValidator.isEqual(profileUpdateDTO.newPassword, profileUpdateDTO.confirmNewPassword)) {
					throw new Error(ErrorsMessages.PASSWORDS_NOT_EQUAL);
				}

				if (!PasswordValidator.validate(profileUpdateDTO.newPassword)) {
					throw new Error(ErrorsMessages.NEW_PASSWORD_IS_INSECURE);
				}
			}

			const userUpdated = await this.usersRepository.update(user_id, profileUpdateDTO);

			return { success: true, data: userUpdated };
		}

		throw new Error(ErrorsMessages.HEADER_AUTHORIZATION_BEARER_TOKEN_EXPIRED_OR_INVALID);
	}
}
