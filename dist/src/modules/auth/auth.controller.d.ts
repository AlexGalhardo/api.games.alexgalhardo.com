import { Request, Response } from "express";
import { AuthResponse } from "src/modules/auth/dtos/auth-response.swagger";
import { AuthRegisterBodyDTO } from "src/modules/auth/dtos/auth-register.swagger";
import { AuthLoginDTO, AuthLoginUseCasePort } from "./use-cases/auth-login.use-case";
import { AuthCheckResetPasswordTokenUseCasePort, CheckResetPasswordTokenDTO } from "./use-cases/auth-check-reset-password-token.use-case";
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
    resetPassword(authResetPasswordDTO: AuthResetPasswordDTO, reset_password_token: string, response: Response): Promise<Response<AuthResponse>>;
    loginGoogle(request: Request, response: Response): Promise<Response<AuthResponse>>;
    loginGithub(request: Request, response: Response): Promise<Response<AuthResponse>>;
}
export declare class AuthController implements AuthControllerPort {
    private readonly authLoginUseCase;
    private readonly authLoginGoogleUseCase;
    private readonly authLoginGitHubUseCase;
    private readonly authRegisterUseCase;
    private readonly authLogoutUseCase;
    private readonly authCheckUserJWTTokenUseCase;
    private readonly authForgetPasswordUseCase;
    private readonly authResetPasswordUseCase;
    private readonly authCheckResetPasswordTokenUseCase;
    constructor(authLoginUseCase: AuthLoginUseCasePort, authLoginGoogleUseCase: AuthLoginGoogleUseCasePort, authLoginGitHubUseCase: AuthLoginGitHubUseCasePort, authRegisterUseCase: AuthRegisterUseCasePort, authLogoutUseCase: AuthLogoutUseCasePort, authCheckUserJWTTokenUseCase: AuthCheckUserJWTTokenUseCasePort, authForgetPasswordUseCase: AuthForgetPasswordUseCasePort, authResetPasswordUseCase: AuthResetPasswordUseCasePort, authCheckResetPasswordTokenUseCase: AuthCheckResetPasswordTokenUseCasePort);
    login(authLoginPayload: AuthLoginDTO, response: Response): Promise<Response<AuthResponse>>;
    register(authRegisterPayload: AuthRegisterBodyDTO, response: Response): Promise<Response<AuthResponse>>;
    logout(response: Response): Promise<Response<AuthResponse>>;
    tokenUser(response: Response): Promise<Response<AuthResponse>>;
    forgetPassword(authForgetPasswordPayload: AuthForgetPasswordDTO, response: Response): Promise<Response<AuthResponse>>;
    resetPassword(authResetPasswordPayload: AuthResetPasswordDTO, reset_password_token: string, response: Response): Promise<Response<AuthResponse>>;
    checkResetPasswordToken({ resetPasswordToken }: CheckResetPasswordTokenDTO, response: Response): Promise<Response<AuthResponse>>;
    loginGoogle(request: Request, response: Response): Promise<Response<AuthResponse>>;
    loginGithub(request: Request, response: Response): Promise<Response<AuthResponse>>;
}
export {};
