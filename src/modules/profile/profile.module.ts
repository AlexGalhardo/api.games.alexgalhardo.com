import { Module } from "@nestjs/common";
import UsersRepository, { UsersRepositoryPort } from "../../repositories/users.repository";
import ProfileUpdateUseCase from "./use-cases/profile-update.use-case";
import { Database } from "../../config/database.config";
import { ProfileController } from "./profile.controller";

@Module({
	controllers: [ProfileController],
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
			provide: "ProfileUpdateUseCasePort",
			inject: ["UsersRepositoryPort"],
			useFactory: (usersRepository: UsersRepositoryPort) => {
				return new ProfileUpdateUseCase(usersRepository);
			},
		},
	],
})
export class ProfileModule {}
