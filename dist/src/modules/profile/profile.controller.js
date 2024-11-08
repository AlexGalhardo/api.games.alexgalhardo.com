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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const profile_response_swagger_1 = require("./dtos/profile-response.swagger");
const telegram_logger_config_1 = require("../../config/telegram-logger.config");
const profile_update_swagger_1 = require("./dtos/profile-update.swagger");
let ProfileController = class ProfileController {
    constructor(profileUpdateUseCase) {
        this.profileUpdateUseCase = profileUpdateUseCase;
    }
    async update(profileUpdatePayload, response) {
        try {
            const userJWTToken = response.locals.token;
            const { success, data } = await this.profileUpdateUseCase.execute(userJWTToken, profileUpdatePayload);
            if (success)
                return response.status(common_1.HttpStatus.OK).json({ success: true, data });
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false });
        }
        catch (error) {
            telegram_logger_config_1.default.error(`ERROR Profile Update: ${error.message}`);
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Put)("/"),
    (0, swagger_1.ApiBody)({ type: profile_update_swagger_1.ProfileUpdateBodyDTO }),
    (0, swagger_1.ApiResponse)({ status: 200, type: profile_response_swagger_1.ProfileResponse }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [profile_update_swagger_1.ProfileUpdateBodyDTO, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "update", null);
exports.ProfileController = ProfileController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)("profile"),
    (0, common_1.Controller)("profile"),
    __param(0, (0, common_1.Inject)("ProfileUpdateUseCasePort")),
    __metadata("design:paramtypes", [Object])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map