import { ApiProperty } from "@nestjs/swagger";

export class GameBodyDTO {
	@ApiProperty()
	id: string;

	@ApiProperty()
	title: string;

	@ApiProperty()
	summary: string;
}
