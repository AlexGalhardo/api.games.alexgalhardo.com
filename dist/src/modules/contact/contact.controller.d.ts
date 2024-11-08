import { Response } from "express";
import { ContactSendMessageDTO, ContactSendMessageUseCasePort } from "./use-cases/contact-send-message.use-case";
import { ContactResponse } from "./dtos/contact-response.swagger";
interface ContactControllerPort {
    contactSendMessage(contactSendMessageDTO: ContactSendMessageDTO, response: Response): Promise<Response<ContactResponse>>;
}
export declare class ContactController implements ContactControllerPort {
    private readonly contactSendMessageUseCase;
    constructor(contactSendMessageUseCase: ContactSendMessageUseCasePort);
    contactSendMessage(contactSendMessageDTO: ContactSendMessageDTO, response: Response): Promise<Response<ContactResponse>>;
}
export {};
