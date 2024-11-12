import { ApiProperty } from "@nestjs/swagger";
import { Game } from "@prisma/client";

export class GamesResponse {
	@ApiProperty()
	success: boolean;

	@ApiProperty()
	error?: string;

	@ApiProperty()
	data?: Game | Game[];

	@ApiProperty()
	api_requests_today?: number;
}
