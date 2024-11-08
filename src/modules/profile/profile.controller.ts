import { Body, Controller, HttpStatus, Inject, Put, Res } from "@nestjs/common";
import { Response } from "express";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProfileResponse } from "src/modules/profile/dtos/profile-response.swagger";
import TelegramLog from "src/config/telegram-logger.config";
import { ProfileUpdateBodyDTO } from "./dtos/profile-update.swagger";
import { ProfileUpdateUseCasePort } from "./use-cases/profile-update.use-case";

interface ProfileControllerPort {
	update(profileUpdateDTO: ProfileUpdateBodyDTO, response: Response): Promise<Response<ProfileResponse>>;
}

@ApiBearerAuth()
@ApiTags("profile")
@Controller("profile")
export class ProfileController implements ProfileControllerPort {
	constructor(@Inject("ProfileUpdateUseCasePort") private readonly profileUpdateUseCase: ProfileUpdateUseCasePort) {}

	@Put("/")
	@ApiBody({ type: ProfileUpdateBodyDTO })
	@ApiResponse({ status: 200, type: ProfileResponse })
	async update(
		@Body() profileUpdatePayload: ProfileUpdateBodyDTO,
		@Res() response: Response,
	): Promise<Response<ProfileResponse>> {
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
