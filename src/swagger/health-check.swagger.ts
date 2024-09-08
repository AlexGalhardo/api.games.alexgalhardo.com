import { ApiProperty } from "@nestjs/swagger";

export class HealthCheckResponse {
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    message: string;
}
