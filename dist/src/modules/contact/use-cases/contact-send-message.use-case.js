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
const common_1 = require("@nestjs/common");
const date_time_util_1 = require("../../../utils/date-time.util");
const telegram_logger_config_1 = require("../../../config/telegram-logger.config");
let ContactSendMessageUseCase = class ContactSendMessageUseCase {
    constructor(smtp) {
        this.smtp = smtp;
    }
    async execute(contactSendMessageDTO) {
        const { name, email, subject, message } = contactSendMessageDTO;
        if (name && email && subject && message) {
            await this.smtp.sendMail({
                from: process.env.SMTP_EMAIL_FROM,
                to: "aleexgvieira@gmail.com",
                subject: `NerdAPI: Message from ${email}: ${subject}`,
                html: `
                    <p><strong>DATE:</strong> ${new Date()}</p>
                    <p><strong>DateTime PT-BR:</strong> ${date_time_util_1.default.getNow()}</p>
                    <p><strong>NAME:</strong> ${name}</p>
                    <p><strong>EMAIL:</strong> ${email}</p>
                    <p><strong>SUBJECT:</strong> ${subject}</p>
                    <hr>
                    <p><strong>MESSAGE:</strong> ${message}</p>
                `,
            });
            telegram_logger_config_1.default.info(`
				<b>NAME:</b> ${name}
				<b>EMAIL:</b> ${email}
				<b>SUBJECT:</b> ${subject}
				<b>MESSAGE:</b> ${message}`);
            return { success: true };
        }
        return { success: false };
    }
};
ContactSendMessageUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("SMTP")),
    __metadata("design:paramtypes", [Object])
], ContactSendMessageUseCase);
exports.default = ContactSendMessageUseCase;
//# sourceMappingURL=contact-send-message.use-case.js.map