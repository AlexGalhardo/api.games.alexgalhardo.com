import { Body, Controller, HttpStatus, Inject, Put, Res } from "@nestjs/common";
import { Response } from "express";
import { ProfileUpdateUseCasePort } from "../use-cases/profile-update.use-case";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SwaggerProfileUpdateBodyDTO } from "../swagger/profile-update.swagger";
import { SwaggerProfileResponse } from "src/swagger/profile-response.swagger";
import TelegramLog from "src/config/telegram-logger.config";

interface ProfileControllerPort {
    update(
        profileUpdateDTO: SwaggerProfileUpdateBodyDTO,
        response: Response,
    ): Promise<Response<SwaggerProfileResponse>>;
}

@ApiBearerAuth()
@ApiTags("profile")
@Controller("profile")
export class ProfileController implements ProfileControllerPort {
    constructor(@Inject("ProfileUpdateUseCasePort") private readonly profileUpdateUseCase: ProfileUpdateUseCasePort) {}

    @Put("/")
    @ApiBody({ type: SwaggerProfileUpdateBodyDTO })
    @ApiResponse({ status: 200, type: SwaggerProfileResponse })
    async update(
        @Body() profileUpdatePayload: SwaggerProfileUpdateBodyDTO,
        @Res() response: Response,
    ): Promise<Response<SwaggerProfileResponse>> {
        try {
            const userJWTToken = response.locals.token;
            const { success, data } = await this.profileUpdateUseCase.execute(userJWTToken, profileUpdatePayload);
            if (success) return response.status(HttpStatus.OK).json({ success: true, data });
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false });
        } catch (error: any) {
            TelegramLog.error(`ERROR Profile Update: ${error.message}`);
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
}
