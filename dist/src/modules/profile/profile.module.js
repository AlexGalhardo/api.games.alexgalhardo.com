"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModule = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("../../repositories/users.repository");
const profile_update_use_case_1 = require("./use-cases/profile-update.use-case");
const database_config_1 = require("../../config/database.config");
const profile_controller_1 = require("./profile.controller");
let ProfileModule = class ProfileModule {
};
exports.ProfileModule = ProfileModule;
exports.ProfileModule = ProfileModule = __decorate([
    (0, common_1.Module)({
        controllers: [profile_controller_1.ProfileController],
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
                provide: "ProfileUpdateUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new profile_update_use_case_1.default(usersRepository);
                },
            },
        ],
    })
], ProfileModule);
//# sourceMappingURL=profile.module.js.map