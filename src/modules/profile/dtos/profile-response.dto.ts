import { ApiProperty } from "@nestjs/swagger";

export class ProfileResponse {
	@ApiProperty()
	success: boolean;

	@ApiProperty()
	data?: any;
}
