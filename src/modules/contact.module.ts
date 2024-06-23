import { Module } from "@nestjs/common";
import { ContactController } from "../controllers/contact.controller";
import ContactSendMessageUseCase from "../use-cases/contact-send-message.use-case";
import { SMTP } from "../config/smtp.config";

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
