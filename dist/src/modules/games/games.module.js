"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesModule = void 0;
const common_1 = require("@nestjs/common");
const games_repository_1 = require("../../repositories/games.repository");
const users_repository_1 = require("../../repositories/users.repository");
const game_get_by_id_use_case_1 = require("./use-cases/game-get-by-id.use-case");
const game_get_by_title_use_case_1 = require("./use-cases/game-get-by-title.use-case");
const game_get_random_use_case_1 = require("./use-cases/game-get-random.use-case");
const database_config_1 = require("../../config/database.config");
const games_controller_1 = require("./games.controller");
let GamesModule = class GamesModule {
};
exports.GamesModule = GamesModule;
exports.GamesModule = GamesModule = __decorate([
    (0, common_1.Module)({
        controllers: [games_controller_1.GamesController],
        providers: [
            database_config_1.Database,
            {
                provide: "GamesRepositoryPort",
                inject: [database_config_1.Database],
                useFactory: (database) => {
                    return new games_repository_1.default(undefined, database);
                },
            },
            {
                provide: "UsersRepositoryPort",
                inject: [database_config_1.Database],
                useFactory: (database) => {
                    return new users_repository_1.default(undefined, database);
                },
            },
            {
                provide: "GameGetRandomUseCasePort",
                inject: ["GamesRepositoryPort", "UsersRepositoryPort"],
                useFactory: (gamesRepository, usersRepository) => {
                    return new game_get_random_use_case_1.default(gamesRepository, usersRepository);
                },
            },
            {
                provide: "GameGetByIdUseCasePort",
                inject: ["GamesRepositoryPort", "UsersRepositoryPort"],
                useFactory: (gamesRepository, usersRepository) => {
                    return new game_get_by_id_use_case_1.default(gamesRepository, usersRepository);
                },
            },
            {
                provide: "GameGetByTitleUseCasePort",
                inject: ["GamesRepositoryPort", "UsersRepositoryPort"],
                useFactory: (gamesRepository, usersRepository) => {
                    return new game_get_by_title_use_case_1.default(gamesRepository, usersRepository);
                },
            },
        ],
    })
], GamesModule);
//# sourceMappingURL=games.module.js.map