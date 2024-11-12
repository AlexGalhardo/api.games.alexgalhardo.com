import { Module } from "@nestjs/common";
import UsersRepository, { UsersRepositoryPort } from "../../repositories/users.repository";
import AuthCheckResetPasswordTokenUseCase from "./use-cases/auth-check-reset-password-token.use-case";
import AuthForgetPasswordUseCase from "./use-cases/auth-forget-password.use-case";
import AuthLoginUseCase from "./use-cases/auth-login.use-case";
import AuthLoginGitHubUseCase from "./use-cases/auth-login-github.use-case";
import AuthLoginGoogleUseCase from "./use-cases/auth-login-google.use-case";
import AuthLogoutUseCase from "./use-cases/auth-logout.use-case";
import AuthSignupUseCase from "./use-cases/auth-signup.use-case";
import AuthResetPasswordUseCase from "./use-cases/auth-reset-password.use-case";
import { Database } from "../../config/database.config";
import { AuthController } from "./auth.controller";
import AuthCheckUserAuthTokenUseCase from "./use-cases/auth-check-user-auth-token.use-case";

@Module({
	controllers: [AuthController],
	providers: [
		Database,
		{
			provide: "UsersRepositoryPort",
			inject: [Database],
			useFactory: (database: Database) => {
				return new UsersRepository(database);
			},
		},
		{
			provide: "AuthLoginUseCasePort",
			inject: ["UsersRepositoryPort"],
			useFactory: (usersRepository: UsersRepositoryPort) => {
				return new AuthLoginUseCase(usersRepository);
			},
		},
		{
			provide: "AuthLoginGoogleUseCasePort",
			inject: ["UsersRepositoryPort"],
			useFactory: (usersRepository: UsersRepositoryPort) => {
				return new AuthLoginGoogleUseCase(usersRepository);
			},
		},
		{
			provide: "AuthLoginGitHubUseCasePort",
			inject: ["UsersRepositoryPort"],
			useFactory: (usersRepository: UsersRepositoryPort) => {
				return new AuthLoginGitHubUseCase(usersRepository);
			},
		},
		{
			provide: "AuthSignupUseCasePort",
			inject: ["UsersRepositoryPort"],
			useFactory: (usersRepository: UsersRepositoryPort) => {
				return new AuthSignupUseCase(usersRepository);
			},
		},
		{
			provide: "AuthLogoutUseCasePort",
			inject: ["UsersRepositoryPort"],
			useFactory: (usersRepository: UsersRepositoryPort) => {
				return new AuthLogoutUseCase(usersRepository);
			},
		},
		{
			provide: "AuthCheckUserAuthTokenUseCasePort",
			inject: ["UsersRepositoryPort"],
			useFactory: (usersRepository: UsersRepositoryPort) => {
				return new AuthCheckUserAuthTokenUseCase(usersRepository);
			},
		},
		{
			provide: "AuthForgetPasswordUseCasePort",
			inject: ["UsersRepositoryPort"],
			useFactory: (usersRepository: UsersRepositoryPort) => {
				return new AuthForgetPasswordUseCase(usersRepository);
			},
		},
		{
			provide: "AuthResetPasswordUseCasePort",
			inject: ["UsersRepositoryPort"],
			useFactory: (usersRepository: UsersRepositoryPort) => {
				return new AuthResetPasswordUseCase(usersRepository);
			},
		},
		{
			provide: "AuthCheckResetPasswordTokenUseCasePort",
			inject: ["UsersRepositoryPort"],
			useFactory: (usersRepository: UsersRepositoryPort) => {
				return new AuthCheckResetPasswordTokenUseCase(usersRepository);
			},
		},
	],
})
export class AuthModule {}
