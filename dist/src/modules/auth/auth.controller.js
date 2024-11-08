"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_login_swagger_1 = require("./dtos/auth-login.swagger");
const auth_response_swagger_1 = require("./dtos/auth-response.swagger");
const auth_register_swagger_1 = require("./dtos/auth-register.swagger");
const telegram_logger_config_1 = require("../../config/telegram-logger.config");
const auth_forget_password_swagger_1 = require("./dtos/auth-forget-password.swagger");
let AuthController = class AuthController {
    constructor(authLoginUseCase, authLoginGoogleUseCase, authLoginGitHubUseCase, authRegisterUseCase, authLogoutUseCase, authCheckUserJWTTokenUseCase, authForgetPasswordUseCase, authResetPasswordUseCase, authCheckResetPasswordTokenUseCase) {
        this.authLoginUseCase = authLoginUseCase;
        this.authLoginGoogleUseCase = authLoginGoogleUseCase;
        this.authLoginGitHubUseCase = authLoginGitHubUseCase;
        this.authRegisterUseCase = authRegisterUseCase;
        this.authLogoutUseCase = authLogoutUseCase;
        this.authCheckUserJWTTokenUseCase = authCheckUserJWTTokenUseCase;
        this.authForgetPasswordUseCase = authForgetPasswordUseCase;
        this.authResetPasswordUseCase = authResetPasswordUseCase;
        this.authCheckResetPasswordTokenUseCase = authCheckResetPasswordTokenUseCase;
    }
    async login(authLoginPayload, response) {
        try {
            const { success, jwt_token, message } = await this.authLoginUseCase.execute(authLoginPayload);
            if (success === true)
                return response.status(common_1.HttpStatus.OK).json({ success: true, jwt_token });
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, message });
        }
        catch (error) {
            telegram_logger_config_1.default.error(`ERROR Auth Login: ${error.message}`);
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
    async register(authRegisterPayload, response) {
        try {
            const { success, jwt_token } = await this.authRegisterUseCase.execute(authRegisterPayload);
            if (success === true)
                return response.status(common_1.HttpStatus.CREATED).json({ success: true, jwt_token });
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false });
        }
        catch (error) {
            telegram_logger_config_1.default.error(`ERROR Auth Register: ${error.message}`);
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
    async logout(response) {
        try {
            const userJWTToken = response.locals.token;
            const { success } = await this.authLogoutUseCase.execute(userJWTToken);
            if (success)
                return response.status(common_1.HttpStatus.OK).json({ success: true });
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false });
        }
        catch (error) {
            telegram_logger_config_1.default.error(`ERROR Auth Logout: ${error.message}`);
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
    async tokenUser(response) {
        try {
            const userJWTToken = response.locals.token;
            const { success, data } = await this.authCheckUserJWTTokenUseCase.execute(userJWTToken);
            if (success)
                return response.status(common_1.HttpStatus.OK).json({ success: true, data });
        }
        catch (error) {
            telegram_logger_config_1.default.error(`ERROR Auth check user jwt token: ${error.message}`);
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
    async forgetPassword(authForgetPasswordPayload, response) {
        try {
            const { success } = await this.authForgetPasswordUseCase.execute(authForgetPasswordPayload);
            if (success)
                return response.status(common_1.HttpStatus.OK).json({ success: true });
        }
        catch (error) {
            telegram_logger_config_1.default.error(`ERROR auth forget password: ${error.message}`);
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
    async resetPassword(authResetPasswordPayload, reset_password_token, response) {
        try {
            const { success } = await this.authResetPasswordUseCase.execute(reset_password_token, authResetPasswordPayload);
            if (success)
                return response.status(common_1.HttpStatus.OK).json({ success: true });
        }
        catch (error) {
            telegram_logger_config_1.default.error(`ERROR auth reset password: ${error.message}`);
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
    async checkResetPasswordToken({ resetPasswordToken }, response) {
        try {
            const { success } = await this.authCheckResetPasswordTokenUseCase.execute(resetPasswordToken);
            if (success)
                return response.status(common_1.HttpStatus.OK).json({ success: true });
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false });
        }
        catch (error) {
            telegram_logger_config_1.default.error(`ERROR auth check reset password token: ${error.message}`);
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
    async loginGoogle(request, response) {
        try {
            const { success, redirect } = await this.authLoginGoogleUseCase.execute(request);
            if (success) {
                response.redirect(redirect);
            }
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false });
        }
        catch (error) {
            telegram_logger_config_1.default.error(`ERROR auth login google: ${error.message}`);
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
    async loginGithub(request, response) {
        try {
            const { success, redirect } = await this.authLoginGitHubUseCase.execute(request);
            if (success) {
                response.redirect(redirect);
            }
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false });
        }
        catch (error) {
            telegram_logger_config_1.default.error(`ERROR auth login github: ${error.message}`);
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("/login"),
    (0, swagger_1.ApiBody)({ type: auth_login_swagger_1.AuthLoginBodyDTO }),
    (0, swagger_1.ApiResponse)({ status: 200, type: auth_response_swagger_1.AuthResponse }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("/register"),
    (0, swagger_1.ApiBody)({ type: auth_register_swagger_1.AuthRegisterBodyDTO }),
    (0, swagger_1.ApiResponse)({ status: 201, type: auth_response_swagger_1.AuthResponse }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_register_swagger_1.AuthRegisterBodyDTO, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("/logout"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, type: auth_response_swagger_1.AuthResponse }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)("/check-user-jwt-token"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, type: auth_response_swagger_1.AuthResponse }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "tokenUser", null);
__decorate([
    (0, common_1.Post)("/forget-password"),
    (0, swagger_1.ApiBody)({ type: auth_forget_password_swagger_1.AuthForgetPasswordBodyDTO }),
    (0, swagger_1.ApiResponse)({ status: 200, type: auth_response_swagger_1.AuthResponse }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgetPassword", null);
__decorate([
    (0, common_1.Post)("/reset-password/:reset_password_token"),
    (0, swagger_1.ApiParam)({
        name: "reset_password_token",
        description: "Reset password token",
        example: "9ee056764ab4492fba9712ddbe32a127",
        required: true,
        type: String,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: auth_response_swagger_1.AuthResponse }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)("reset_password_token")),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)("/check-reset-password-token"),
    (0, swagger_1.ApiBody)({ type: auth_forget_password_swagger_1.AuthForgetPasswordBodyDTO }),
    (0, swagger_1.ApiResponse)({ status: 200, type: auth_response_swagger_1.AuthResponse }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkResetPasswordToken", null);
__decorate([
    (0, common_1.Post)("/login/google/callback"),
    (0, swagger_1.ApiResponse)({ status: 200, type: auth_response_swagger_1.AuthResponse }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginGoogle", null);
__decorate([
    (0, common_1.Get)("/login/github/callback"),
    (0, swagger_1.ApiResponse)({ status: 200, type: auth_response_swagger_1.AuthResponse }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginGithub", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)("AuthLoginUseCasePort")),
    __param(1, (0, common_1.Inject)("AuthLoginGoogleUseCasePort")),
    __param(2, (0, common_1.Inject)("AuthLoginGitHubUseCasePort")),
    __param(3, (0, common_1.Inject)("AuthRegisterUseCasePort")),
    __param(4, (0, common_1.Inject)("AuthLogoutUseCasePort")),
    __param(5, (0, common_1.Inject)("AuthCheckUserJWTTokenUseCasePort")),
    __param(6, (0, common_1.Inject)("AuthForgetPasswordUseCasePort")),
    __param(7, (0, common_1.Inject)("AuthResetPasswordUseCasePort")),
    __param(8, (0, common_1.Inject)("AuthCheckResetPasswordTokenUseCasePort")),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, Object, Object])
], AuthController);
//# sourceMappingURL=auth.controller.js.map