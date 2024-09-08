import { Controller, Post, Res, Body, Inject, HttpStatus } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { ContactResponse } from "../swagger/contact-response.swagger";
import { ContactSendMessageDTO, ContactSendMessageUseCasePort } from "../use-cases/contact-send-message.use-case";
import { ContactBodyDTO } from "src/swagger/contact-body.swagger";
import TelegramLog from "src/config/telegram-logger.config";

interface ContactControllerPort {
    contactSendMessage(
        contactSendMessageDTO: ContactSendMessageDTO,
        response: Response,
    ): Promise<Response<ContactResponse>>;
}

@Controller("/contact")
@ApiTags("contact")
export class ContactController implements ContactControllerPort {
    constructor(
        @Inject("ContactSendMessageUseCasePort")
        private readonly contactSendMessageUseCase: ContactSendMessageUseCasePort,
    ) {}

    @Post("/")
    @ApiBody({ type: ContactBodyDTO })
    @ApiResponse({ status: 200, type: ContactResponse })
    async contactSendMessage(
        @Body() contactSendMessageDTO: ContactSendMessageDTO,
        @Res() response: Response,
    ): Promise<Response<ContactResponse>> {
        try {
            const { success } = await this.contactSendMessageUseCase.execute(contactSendMessageDTO);
            if (success) return response.status(HttpStatus.OK).json({ success: true });
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false });
        } catch (error: any) {
            TelegramLog.error(`ERROR Contact send message: ${error.message}`);
            return response.status(HttpStatus.BAD_REQUEST).json({ success: false, error: error.message });
        }
    }
}
