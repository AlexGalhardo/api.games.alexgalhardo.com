import { ApiProperty } from "@nestjs/swagger";

export class AuthResponse {
	@ApiProperty()
	success: boolean;

	@ApiProperty()
	jwt_token?: string;

	@ApiProperty()
	message?: string;

	@ApiProperty()
	error?: string;

	@ApiProperty()
	redirect?: string;
}
