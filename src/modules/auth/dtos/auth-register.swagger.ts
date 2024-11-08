import { ApiProperty } from "@nestjs/swagger";

export class AuthRegisterBodyDTO {
	@ApiProperty({ example: "John Doe", description: "User name" })
	name: string;

	@ApiProperty({ example: "john.doe@example.com", description: "User email" })
	email: string;

	@ApiProperty({ example: "strongPassword!123", description: "User Password" })
	password: string;

	@ApiProperty({ example: "5518996977777", description: "User phone number" })
	phone_number?: string;
}
