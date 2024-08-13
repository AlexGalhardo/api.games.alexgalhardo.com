import { ApiProperty } from "@nestjs/swagger";

export class SwaggerContactResponse {
    @ApiProperty()
    success: boolean;
}
