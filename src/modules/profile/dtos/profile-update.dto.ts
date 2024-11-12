import { IsString } from "class-validator";

export class ProfileUpdateDTO {
	@IsString()
	readonly name: string;

	@IsString()
	readonly phone_number: string;

	@IsString()
	readonly new_password: string;

	@IsString()
	readonly confirm_new_password: string;
}
