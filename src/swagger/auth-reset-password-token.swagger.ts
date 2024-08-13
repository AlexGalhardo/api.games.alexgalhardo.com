import { ApiProperty } from "@nestjs/swagger";

export class SwaggerAuthRegisterBodyDTO {
    @ApiProperty({ example: "9ee056764ab4492fba9712ddbe32a127", description: "Reset password token" })
    resetPasswordToken: string;
}
