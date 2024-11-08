import { Controller, Post, Res, Body, Inject, HttpStatus, Req, Get, Param } from "@nestjs/common";
import { Request, Response } from "express";
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthLoginBodyDTO } from "src/modules/auth/dtos/auth-login.swagger";
import { AuthResponse } from "src/modules/auth/dtos/auth-response.swagger";
import { AuthRegisterBodyDTO } from "src/modules/auth/dtos/auth-register.swagger";
import TelegramLog from "src/config/telegram-logger.config";
import { AuthForgetPasswordBodyDTO } from "src/modules/auth/dtos/auth-forget-password.swagger";
import { AuthLoginDTO, AuthLoginUseCasePort } from "./use-cases/auth-login.use-case";
import {
	AuthCheckResetPasswordTokenUseCasePort,
	CheckResetPasswordTokenDTO,
} from "./use-cases/auth-check-reset-password-token.use-case";
import { AuthCheckUserJWTTokenUseCasePort } from "./use-cases/auth-check-user-jwt-token.use-case";
import { AuthForgetPasswordDTO, AuthForgetPasswordUseCasePort } from "./use-cases/auth-forget-password.use-case";
import { AuthLoginGitHubUseCasePort } from "./use-cases/auth-login-github.use-case";
import { AuthLoginGoogleUseCasePort } from "./use-cases/auth-login-google.use-case";
import { AuthLogoutUseCasePort } from "./use-cases/auth-logout.use-case";
import { AuthRegisterUseCasePort } from "./use-cases/auth-register.use-case";
import { AuthResetPasswordDTO, AuthResetPasswordUseCasePort } from "./use-cases/auth-reset-password.use-case";

interface AuthControllerPort {
	login(authLoginDTO: AuthLoginDTO, response: Response): Promise<Response<AuthResponse>>;
	register(authRegisterDTO: AuthRegisterBodyDTO, response: Response): Promise<Response<AuthResponse>>;
	logout(response: Response): Promise<Response<AuthResponse>>;
	tokenUser(response: Response): Promise<Response<AuthResponse>>;
	forgetPassword(authForgetPasswordDTO: AuthForgetPasswordDTO, response: Response): Promise<Response<AuthResponse>>;
	resetPassword(
		authResetPasswordDTO: AuthResetPasswordDTO,
		reset_password_token: string,
		response: Response,
	): Promise<Response<AuthResponse>>;
	loginGoogle(request: Request, response: Response): Promise<Response<AuthResponse>>;
	loginGithub(request: Request, response: Response): Promise<Response<AuthResponse>>;
}

@ApiTags("auth")
@Controller()
export class AuthController implements AuthControllerPort {
	constructor(
		@Inject("AuthLoginUseCasePort") private readonly authLoginUseCase: AuthLoginUseCasePort,
		@Inject("AuthLoginGoogleUseCasePort") private readonly authLoginGoogleUseCase: AuthLoginGoogleUseCasePort,
		@Inject("AuthLoginGitHubUseCasePort") private readonly authLoginGitHubUseCase: AuthLoginGitHubUseCasePort,
		@Inject("AuthRegisterUseCasePort") private readonly authRegisterUseCase: AuthRegisterUseCasePort,
		@Inject("AuthLogoutUseCasePort") private readonly authLogoutUseCase: AuthLogoutUseCasePort,
		@Inject("AuthCheckUserJWTTokenUseCasePort")
		private readonly authCheckUserJWTTokenUseCase: AuthCheckUserJWTTokenUseCasePort,
		@Inject("AuthForgetPasswordUseCasePort")
		private readonly authForgetPasswordUseCase: AuthForgetPasswordUseCasePort,
		@Inject("AuthResetPasswordUseCasePort") private readonly authResetPasswordUseCase: AuthResetPasswordUseCasePort,
		@Inject("AuthCheckResetPasswordTokenUseCasePort")
		private readonly authCheckResetPasswordTokenUseCase: AuthCheckResetPasswordTokenUseCasePort,
	) {}

	@Post("/login")
	@ApiBody({ type: AuthLoginBodyDTO })
	@ApiResponse({ status: 200, type: AuthResponse })
	async login(@Body() authLoginPayload: AuthLoginDTO, @Res() response: Response): Promise<Response<AuthResponse>> {
		try {
			const { success, jwt_token, message } = await this.authLoginUseCase.execute(authLoginPayload);
			if (success === true) return response.status(HttpStatus.OK).json({ success: true, jwt_token });
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false, message });
		} catch (error: any) {
			TelegramLog.error(`ERROR Auth Login: ${error.message}`);
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
		}
	}

	@Post("/register")
	@ApiBody({ type: AuthRegisterBodyDTO })
	@ApiResponse({ status: 201, type: AuthResponse })
	async register(
		@Body() authRegisterPayload: AuthRegisterBodyDTO,
		@Res() response: Response,
	): Promise<Response<AuthResponse>> {
		try {
			const { success, jwt_token } = await this.authRegisterUseCase.execute(authRegisterPayload);
			if (success === true) return response.status(HttpStatus.CREATED).json({ success: true, jwt_token });
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false });
		} catch (error: any) {
			TelegramLog.error(`ERROR Auth Register: ${error.message}`);
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
		}
	}

	@Post("/logout")
	@ApiBearerAuth()
	@ApiResponse({ status: 200, type: AuthResponse })
	async logout(@Res() response: Response): Promise<Response<AuthResponse>> {
		try {
			const userJWTToken = response.locals.token;
			const { success } = await this.authLogoutUseCase.execute(userJWTToken);
			if (success) return response.status(HttpStatus.OK).json({ success: true });
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false });
		} catch (error: any) {
			TelegramLog.error(`ERROR Auth Logout: ${error.message}`);
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
		}
	}

	@Post("/check-user-jwt-token")
	@ApiBearerAuth()
	@ApiResponse({ status: 200, type: AuthResponse })
	async tokenUser(@Res() response: Response): Promise<Response<AuthResponse>> {
		try {
			const userJWTToken = response.locals.token;
			const { success, data } = await this.authCheckUserJWTTokenUseCase.execute(userJWTToken);
			if (success) return response.status(HttpStatus.OK).json({ success: true, data });
		} catch (error: any) {
			TelegramLog.error(`ERROR Auth check user jwt token: ${error.message}`);
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
		}
	}

	@Post("/forget-password")
	@ApiBody({ type: AuthForgetPasswordBodyDTO })
	@ApiResponse({ status: 200, type: AuthResponse })
	async forgetPassword(
		@Body() authForgetPasswordPayload: AuthForgetPasswordDTO,
		@Res() response: Response,
	): Promise<Response<AuthResponse>> {
		try {
			const { success } = await this.authForgetPasswordUseCase.execute(authForgetPasswordPayload);
			if (success) return response.status(HttpStatus.OK).json({ success: true });
		} catch (error: any) {
			TelegramLog.error(`ERROR auth forget password: ${error.message}`);
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
		}
	}

	@Post("/reset-password/:reset_password_token")
	@ApiParam({
		name: "reset_password_token",
		description: "Reset password token",
		example: "9ee056764ab4492fba9712ddbe32a127",
		required: true,
		type: String,
	})
	@ApiResponse({ status: 200, type: AuthResponse })
	async resetPassword(
		@Body() authResetPasswordPayload: AuthResetPasswordDTO,
		@Param("reset_password_token") reset_password_token: string,
		@Res() response: Response,
	): Promise<Response<AuthResponse>> {
		try {
			const { success } = await this.authResetPasswordUseCase.execute(
				reset_password_token,
				authResetPasswordPayload,
			);
			if (success) return response.status(HttpStatus.OK).json({ success: true });
		} catch (error: any) {
			TelegramLog.error(`ERROR auth reset password: ${error.message}`);
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
		}
	}

	@Post("/check-reset-password-token")
	@ApiBody({ type: AuthForgetPasswordBodyDTO })
	@ApiResponse({ status: 200, type: AuthResponse })
	async checkResetPasswordToken(
		@Body() { resetPasswordToken }: CheckResetPasswordTokenDTO,
		@Res() response: Response,
	): Promise<Response<AuthResponse>> {
		try {
			const { success } = await this.authCheckResetPasswordTokenUseCase.execute(resetPasswordToken);
			if (success) return response.status(HttpStatus.OK).json({ success: true });
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false });
		} catch (error: any) {
			TelegramLog.error(`ERROR auth check reset password token: ${error.message}`);
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
		}
	}

	@Post("/login/google/callback")
	@ApiResponse({ status: 200, type: AuthResponse })
	async loginGoogle(@Req() request: Request, @Res() response: Response): Promise<Response<AuthResponse>> {
		try {
			const { success, redirect } = await this.authLoginGoogleUseCase.execute(request);
			if (success) {
				response.redirect(redirect);
			}
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false });
		} catch (error: any) {
			TelegramLog.error(`ERROR auth login google: ${error.message}`);
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
		}
	}

	@Get("/login/github/callback")
	@ApiResponse({ status: 200, type: AuthResponse })
	async loginGithub(@Req() request: Request, @Res() response: Response): Promise<Response<AuthResponse>> {
		try {
			const { success, redirect } = await this.authLoginGitHubUseCase.execute(request);
			if (success) {
				response.redirect(redirect);
			}
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false });
		} catch (error: any) {
			TelegramLog.error(`ERROR auth login github: ${error.message}`);
			return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
		}
	}
}
