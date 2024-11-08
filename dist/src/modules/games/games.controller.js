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
exports.GamesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const telegram_logger_config_1 = require("../../config/telegram-logger.config");
const game_response_swagger_1 = require("./dtos/game-response.swagger");
let GamesController = class GamesController {
    constructor(gameGetRandomUseCase, gameGetByIdUseCase, gameGetByTitleUseCase) {
        this.gameGetRandomUseCase = gameGetRandomUseCase;
        this.gameGetByIdUseCase = gameGetByIdUseCase;
        this.gameGetByTitleUseCase = gameGetByTitleUseCase;
    }
    async getRandom(response) {
        try {
            const userAPIKey = response.locals.token;
            const { success, data, error, api_requests_today } = await this.gameGetRandomUseCase.execute(userAPIKey);
            if (success)
                return response.status(common_1.HttpStatus.OK).json({ success: true, api_requests_today, data });
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, error, api_requests_today });
        }
        catch (error) {
            telegram_logger_config_1.default.error(`ERROR Game get random: ${error.message}`);
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
    async findById(game_id, response) {
        try {
            const userAPIKey = response.locals.token;
            const { success, data, error, api_requests_today } = await this.gameGetByIdUseCase.execute(game_id, userAPIKey);
            if (success)
                return response.status(common_1.HttpStatus.OK).json({ success: true, api_requests_today, data });
            return response.status(common_1.HttpStatus.OK).json({ success: false, api_requests_today, error });
        }
        catch (error) {
            telegram_logger_config_1.default.error(`ERROR Game get by id: ${error.message}`);
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
    async getByTitle(game_title, response) {
        try {
            const userAPIKey = response.locals.token;
            const { success, data, error, api_requests_today } = await this.gameGetByTitleUseCase.execute(game_title, userAPIKey);
            if (success)
                return response.status(common_1.HttpStatus.OK).json({ success: true, api_requests_today, data });
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, api_requests_today, error });
        }
        catch (error) {
            telegram_logger_config_1.default.error(`ERROR Game get by title: ${error.message}`);
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
};
exports.GamesController = GamesController;
__decorate([
    (0, common_1.Get)("/random"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Get random game", type: game_response_swagger_1.GamesResponse }),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getRandom", null);
__decorate([
    (0, common_1.Get)("/id/:game_id"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({
        name: "game_id",
        description: "Reset password token",
        example: "d7e4596d-748d-4050-904f-aaed7863f687",
        required: true,
        type: String,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Get game by id", type: game_response_swagger_1.GamesResponse }),
    __param(0, (0, common_1.Param)("game_id")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)("/title/:game_title"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({
        name: "game_title",
        description: "Reset password token",
        example: "God Of War",
        required: true,
        type: String,
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Get game by title", type: game_response_swagger_1.GamesResponse }),
    __param(0, (0, common_1.Param)("game_title")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "getByTitle", null);
exports.GamesController = GamesController = __decorate([
    (0, common_1.Controller)("games"),
    (0, swagger_1.ApiTags)("games"),
    __param(0, (0, common_1.Inject)("GameGetRandomUseCasePort")),
    __param(1, (0, common_1.Inject)("GameGetByIdUseCasePort")),
    __param(2, (0, common_1.Inject)("GameGetByTitleUseCasePort")),
    __metadata("design:paramtypes", [Object, Object, Object])
], GamesController);
//# sourceMappingURL=games.controller.js.map