import { ApiProperty } from "@nestjs/swagger";

export class ContactResponse {
    @ApiProperty()
    success: boolean;
}
