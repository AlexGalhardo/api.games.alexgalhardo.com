import { ApiProperty } from "@nestjs/swagger";

export class Profile {
	@ApiProperty({ example: "jack", description: "user name" })
	name: string;

	@ApiProperty({ example: "test@gmail.com", description: "Email of the user" })
	email: string;

	@ApiProperty({
		example: "5518999999999",
		description: "Telegram number",
	})
	phone_number: string;
}
