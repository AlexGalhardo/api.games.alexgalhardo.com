import { ApiProperty } from "@nestjs/swagger";

export class SwaggerGameBodyDTO {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    summary: string;
}
