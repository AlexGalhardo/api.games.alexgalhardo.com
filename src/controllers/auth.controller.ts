import { Controller, Post, Res, Body, Inject, HttpStatus, Req, Get, Param } from "@nestjs/common";
import { Request, Response } from "express";
import {
    AuthCheckResetPasswordTokenUseCasePort,
    CheckResetPasswordTokenDTO,
} from "../use-cases/auth-check-reset-password-token.use-case";
import { AuthForgetPasswordDTO, AuthForgetPasswordUseCasePort } from "../use-cases/auth-forget-password.use-case";
import { AuthLoginDTO, AuthLoginUseCasePort } from "../use-cases/auth-login.use-case";
import { AuthLoginGitHubUseCasePort } from "../use-cases/auth-login-github.use-case";
import { AuthLoginGoogleUseCasePort } from "../use-cases/auth-login-google.use-case";
import { AuthLogoutUseCasePort } from "../use-cases/auth-logout.use-case";
import { AuthRegisterUseCasePort } from "../use-cases/auth-register.use-case";
import { AuthResetPasswordDTO, AuthResetPasswordUseCasePort } from "../use-cases/auth-reset-password.use-case";
import { AuthCheckUserJWTTokenUseCasePort } from "../use-cases/auth-check-user-jwt-token.use-case";
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SwaggerAuthLoginBodyDTO } from "src/swagger/auth-login.swagger";
import { SwaggerAuthResponse } from "src/swagger/auth-response.swagger";
import { SwaggerAuthRegisterBodyDTO } from "src/swagger/auth-register.swagger";
import TelegramLog from "src/config/telegram-logger.config";
import { SwaggerAuthForgetPasswordBodyDTO } from "src/swagger/auth-forget-password.swagger";

interface AuthControllerPort {
    login(authLoginDTO: AuthLoginDTO, response: Response): Promise<Response<SwaggerAuthResponse>>;
    register(authRegisterDTO: SwaggerAuthRegisterBodyDTO, response: Response): Promise<Response<SwaggerAuthResponse>>;
    logout(response: Response): Promise<Response<SwaggerAuthResponse>>;
    tokenUser(response: Response): Promise<Response<SwaggerAuthResponse>>;
    forgetPassword(
        authForgetPasswordDTO: AuthForgetPasswordDTO,
        response: Response,
    ): Promise<Response<SwaggerAuthResponse>>;
    resetPassword(
        authResetPasswordDTO: AuthResetPasswordDTO,
        reset_password_token: string,
        response: Response,
    ): Promise<Response<SwaggerAuthResponse>>;
    loginGoogle(request: Request, response: Response): Promise<Response<SwaggerAuthResponse>>;
    loginGithub(request: Request, response: Response): Promise<Response<SwaggerAuthResponse>>;
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
    @ApiBody({ type: SwaggerAuthLoginBodyDTO })
    @ApiResponse({ status: 200, type: SwaggerAuthResponse })
    async login(
        @Body() authLoginPayload: AuthLoginDTO,
        @Res() response: Response,
    ): Promise<Response<SwaggerAuthResponse>> {
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
    @ApiBody({ type: SwaggerAuthRegisterBodyDTO })
    @ApiResponse({ status: 201, type: SwaggerAuthResponse })
    async register(
        @Body() authRegisterPayload: SwaggerAuthRegisterBodyDTO,
        @Res() response: Response,
    ): Promise<Response<SwaggerAuthResponse>> {
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
    @ApiResponse({ status: 200, type: SwaggerAuthResponse })
    async logout(@Res() response: Response): Promise<Response<SwaggerAuthResponse>> {
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
    @ApiResponse({ status: 200, type: SwaggerAuthResponse })
    async tokenUser(@Res() response: Response): Promise<Response<SwaggerAuthResponse>> {
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
    @ApiBody({ type: SwaggerAuthForgetPasswordBodyDTO })
    @ApiResponse({ status: 200, type: SwaggerAuthResponse })
    async forgetPassword(
        @Body() authForgetPasswordPayload: AuthForgetPasswordDTO,
        @Res() response: Response,
    ): Promise<Response<SwaggerAuthResponse>> {
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
    @ApiResponse({ status: 200, type: SwaggerAuthResponse })
    async resetPassword(
        @Body() authResetPasswordPayload: AuthResetPasswordDTO,
        @Param("reset_password_token") reset_password_token: string,
        @Res() response: Response,
    ): Promise<Response<SwaggerAuthResponse>> {
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
    @ApiBody({ type: SwaggerAuthForgetPasswordBodyDTO })
    @ApiResponse({ status: 200, type: SwaggerAuthResponse })
    async checkResetPasswordToken(
        @Body() { resetPasswordToken }: CheckResetPasswordTokenDTO,
        @Res() response: Response,
    ): Promise<Response<SwaggerAuthResponse>> {
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
    @ApiResponse({ status: 200, type: SwaggerAuthResponse })
    async loginGoogle(@Req() request: Request, @Res() response: Response): Promise<Response<SwaggerAuthResponse>> {
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
    @ApiResponse({ status: 200, type: SwaggerAuthResponse })
    async loginGithub(@Req() request: Request, @Res() response: Response): Promise<Response<SwaggerAuthResponse>> {
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
