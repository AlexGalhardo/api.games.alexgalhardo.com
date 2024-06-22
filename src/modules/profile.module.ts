import { Module } from "@nestjs/common";
import { ProfileController } from "../controllers/profile.controller.js";
import UsersRepository, { UsersRepositoryPort } from "../repositories/users.repository.js";
import ProfileUpdateUseCase from "../use-cases/profile-update.use-case.js";
import { Database } from "../config/database.config.js";

@Module({
    controllers: [ProfileController],
    providers: [
        Database,
        {
            provide: "UsersRepositoryPort",
            inject: [Database],
            useFactory: (database: Database) => {
                return new UsersRepository(undefined, database);
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
