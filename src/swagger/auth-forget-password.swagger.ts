import { ApiProperty } from "@nestjs/swagger";

export class AuthForgetPasswordBodyDTO {
    @ApiProperty({ example: "john.doe@example.com", description: "The email to send the reset password link" })
    email: string;
}
