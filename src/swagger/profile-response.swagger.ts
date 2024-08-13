import { ApiProperty } from "@nestjs/swagger";

export class SwaggerProfileResponse {
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    data?: any;
}
