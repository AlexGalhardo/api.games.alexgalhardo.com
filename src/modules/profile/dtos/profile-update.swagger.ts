import { IsString } from "class-validator";

export class ProfileUpdateBodyDTO {
	@IsString()
	readonly name: string;

	@IsString()
	readonly phone_number: string;

	@IsString()
	readonly newPassword: string;

	@IsString()
	readonly confirmNewPassword: string;
}
