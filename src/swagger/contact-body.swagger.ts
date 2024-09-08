import { ApiProperty } from "@nestjs/swagger";

export class ContactBodyDTO {
    @ApiProperty({ example: "John Doe", description: "The name of the user" })
    name: string;

    @ApiProperty({ example: "john.doe@example.com", description: "The email address of the user" })
    email: string;

    @ApiProperty({ example: "BUG", description: "Can be: BUG, SUPPORT, BUG" })
    subject: string;

    @ApiProperty({ example: "Hello, I have a doubt about xyz", description: "Contact message" })
    message: string;
}
