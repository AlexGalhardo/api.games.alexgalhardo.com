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
exports.ContactController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contact_body_swagger_1 = require("./dtos/contact-body.swagger");
const telegram_logger_config_1 = require("../../config/telegram-logger.config");
const contact_response_swagger_1 = require("./dtos/contact-response.swagger");
let ContactController = class ContactController {
    constructor(contactSendMessageUseCase) {
        this.contactSendMessageUseCase = contactSendMessageUseCase;
    }
    async contactSendMessage(contactSendMessageDTO, response) {
        try {
            const { success } = await this.contactSendMessageUseCase.execute(contactSendMessageDTO);
            if (success)
                return response.status(common_1.HttpStatus.OK).json({ success: true });
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false });
        }
        catch (error) {
            telegram_logger_config_1.default.error(`ERROR Contact send message: ${error.message}`);
            return response.status(common_1.HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
};
exports.ContactController = ContactController;
__decorate([
    (0, common_1.Post)("/"),
    (0, swagger_1.ApiBody)({ type: contact_body_swagger_1.ContactBodyDTO }),
    (0, swagger_1.ApiResponse)({ status: 200, type: contact_response_swagger_1.ContactResponse }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ContactController.prototype, "contactSendMessage", null);
exports.ContactController = ContactController = __decorate([
    (0, common_1.Controller)("/contact"),
    (0, swagger_1.ApiTags)("contact"),
    __param(0, (0, common_1.Inject)("ContactSendMessageUseCasePort")),
    __metadata("design:paramtypes", [Object])
], ContactController);
//# sourceMappingURL=contact.controller.js.map