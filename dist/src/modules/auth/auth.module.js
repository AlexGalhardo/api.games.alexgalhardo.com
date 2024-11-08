"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("../../repositories/users.repository");
const auth_check_reset_password_token_use_case_1 = require("./use-cases/auth-check-reset-password-token.use-case");
const auth_forget_password_use_case_1 = require("./use-cases/auth-forget-password.use-case");
const auth_login_use_case_1 = require("./use-cases/auth-login.use-case");
const auth_login_github_use_case_1 = require("./use-cases/auth-login-github.use-case");
const auth_login_google_use_case_1 = require("./use-cases/auth-login-google.use-case");
const auth_logout_use_case_1 = require("./use-cases/auth-logout.use-case");
const auth_register_use_case_1 = require("./use-cases/auth-register.use-case");
const auth_reset_password_use_case_1 = require("./use-cases/auth-reset-password.use-case");
const database_config_1 = require("../../config/database.config");
const auth_check_user_jwt_token_use_case_1 = require("./use-cases/auth-check-user-jwt-token.use-case");
const auth_controller_1 = require("./auth.controller");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController],
        providers: [
            database_config_1.Database,
            {
                provide: "UsersRepositoryPort",
                inject: [database_config_1.Database],
                useFactory: (database) => {
                    return new users_repository_1.default(undefined, database);
                },
            },
            {
                provide: "AuthLoginUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new auth_login_use_case_1.default(usersRepository);
                },
            },
            {
                provide: "AuthLoginGoogleUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new auth_login_google_use_case_1.default(usersRepository);
                },
            },
            {
                provide: "AuthLoginGitHubUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new auth_login_github_use_case_1.default(usersRepository);
                },
            },
            {
                provide: "AuthRegisterUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new auth_register_use_case_1.default(usersRepository);
                },
            },
            {
                provide: "AuthLogoutUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new auth_logout_use_case_1.default(usersRepository);
                },
            },
            {
                provide: "AuthCheckUserJWTTokenUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new auth_check_user_jwt_token_use_case_1.default(usersRepository);
                },
            },
            {
                provide: "AuthForgetPasswordUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new auth_forget_password_use_case_1.default(usersRepository);
                },
            },
            {
                provide: "AuthResetPasswordUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new auth_reset_password_use_case_1.default(usersRepository);
                },
            },
            {
                provide: "AuthCheckResetPasswordTokenUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new auth_check_reset_password_token_use_case_1.default(usersRepository);
                },
            },
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map