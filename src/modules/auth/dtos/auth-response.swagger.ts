import { ApiProperty } from "@nestjs/swagger";

export class AuthResponse {
	@ApiProperty()
	success: boolean;

	@ApiProperty()
	auth_token?: string;

	@ApiProperty()

	@ApiProperty()
	error?: string;

	@ApiProperty()
	redirect?: string;
}
