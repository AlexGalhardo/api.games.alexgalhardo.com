import { ApiProperty } from "@nestjs/swagger";

export class SwaggerHealthCheckResponse {
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    message: string;
}
