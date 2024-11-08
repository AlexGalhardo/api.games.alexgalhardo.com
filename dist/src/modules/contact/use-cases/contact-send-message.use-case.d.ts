import { SMTP } from "../../../config/smtp.config";
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
export default class ContactSendMessageUseCase implements ContactSendMessageUseCasePort {
    private readonly smtp;
    constructor(smtp: typeof SMTP);
    execute(contactSendMessageDTO: ContactSendMessageDTO): Promise<{
        success: boolean;
    }>;
}
export {};
