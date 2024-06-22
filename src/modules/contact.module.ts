import { Module } from "@nestjs/common";
import { ContactController } from "../controllers/contact.controller.js";
import ContactSendMessageUseCase from "../use-cases/contact-send-message.use-case.js";
import { SMTP } from "../config/smtp.config.js";

@Module({
    controllers: [ContactController],
    providers: [
        {
            provide: "ContactSendMessageUseCasePort",
            useClass: ContactSendMessageUseCase,
        },
        {
            provide: "SMTP",
            useValue: SMTP,
        },
    ],
})
export class ContactModule {}
