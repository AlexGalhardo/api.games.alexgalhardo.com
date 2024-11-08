"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactModule = void 0;
const common_1 = require("@nestjs/common");
const contact_send_message_use_case_1 = require("./use-cases/contact-send-message.use-case");
const smtp_config_1 = require("../../config/smtp.config");
const contact_controller_1 = require("./contact.controller");
let ContactModule = class ContactModule {
};
exports.ContactModule = ContactModule;
exports.ContactModule = ContactModule = __decorate([
    (0, common_1.Module)({
        controllers: [contact_controller_1.ContactController],
        providers: [
            {
                provide: "ContactSendMessageUseCasePort",
                useClass: contact_send_message_use_case_1.default,
            },
            {
                provide: "SMTP",
                useValue: smtp_config_1.SMTP,
            },
        ],
    })
], ContactModule);
//# sourceMappingURL=contact.module.js.map