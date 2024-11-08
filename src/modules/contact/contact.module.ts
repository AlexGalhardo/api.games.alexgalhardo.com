import { Module } from "@nestjs/common";
import ContactSendMessageUseCase from "./use-cases/contact-send-message.use-case";
import { SMTP } from "../../config/smtp.config";
import { ContactController } from "./contact.controller";

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
