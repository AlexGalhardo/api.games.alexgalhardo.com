import { IsString } from "class-validator";

export class SwaggerProfileUpdateBodyDTO {
    @IsString()
    readonly name: string;

    @IsString()
    readonly telegramNumber: string;

    @IsString()
    readonly newPassword: string;

    @IsString()
    readonly confirmNewPassword: string;
}
