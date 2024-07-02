import { Injectable, Inject } from "@nestjs/common";
import { SMTP } from "../config/smtp.config";
import DateTime from "../utils/date-time.util";
import TelegramLog from "../config/telegram-logger.config";
import ContactSendMessageValidator from "src/validators/contact-send-message.validator";

export interface ContactSendMessageDTO {
	name: string;
	email: string;
	subject: string;
	message: string;
}

interface ContactSendMessageUseCaseResponse {
	success: boolean;
}

export interface ContactSendMessageUseCasePort {
	execute(contactSendMessageDTO: ContactSendMessageDTO): Promise<ContactSendMessageUseCaseResponse>;
}

@Injectable()
export default class ContactSendMessageUseCase implements ContactSendMessageUseCasePort {
	constructor(@Inject("SMTP") private readonly smtp: typeof SMTP) { }

	async execute(contactSendMessagePayload: ContactSendMessageDTO): Promise<{ success: boolean }> {
		try {
			ContactSendMessageValidator.parse(contactSendMessagePayload)

			const { name, email, subject, message } = contactSendMessagePayload;

			if (name && email && subject && message) {
				await this.smtp.sendMail({
					from: process.env.SMTP_EMAIL_FROM,
					to: "aleexgvieira@gmail.com",
					subject: `NerdAPI: Message from ${email}: ${subject}`,
					html: `
                    <p><strong>DATE:</strong> ${new Date()}</p>
                    <p><strong>DateTime PT-BR:</strong> ${DateTime.getNow()}</p>
                    <p><strong>NAME:</strong> ${name}</p>
                    <p><strong>EMAIL:</strong> ${email}</p>
                    <p><strong>SUBJECT:</strong> ${subject}</p>
                    <hr>
                    <p><strong>MESSAGE:</strong> ${message}</p>
                `,
				});

				TelegramLog.info(`
				<b>NAME:</b> ${name}
				<b>EMAIL:</b> ${email}
				<b>SUBJECT:</b> ${subject}
				<b>MESSAGE:</b> ${message}`);

				return { success: true };
			}

			return { success: false };
		}
		catch (error: any) {
			return { success: false };
		}
	}
}
