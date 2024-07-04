import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../app.module";
import { ContactSendMessageDTO } from "./contact-send-message.use-case";
import { SentMessageInfo, Transporter } from "nodemailer";
import { mock } from "jest-mock-extended";

describe("ContactSendMessageController (e2e)", () => {
    let app: INestApplication;
    const mockSMTP = mock<Transporter<SentMessageInfo>>();

    beforeAll(async () => {
        // jest.setTimeout(10000);

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider("SMTP")
            .useValue(mockSMTP)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should POST /contact and send an email successfully", async () => {
        const contactSendMessageDTO: ContactSendMessageDTO = {
            name: "John Doe",
            email: "john.doe@example.com",
            subject: "Test Subject",
            message: "This is a test message.",
        };

        const response = await request(app.getHttpServer()).post("/contact").send(contactSendMessageDTO).expect(200);

        expect(response.body).toStrictEqual({ success: true });
    });

    it("should POST /contact and return success false when required fields are missing", async () => {
        // await new Promise(resolve => setTimeout(resolve, 1000));
        // todo: verify error without to many request, to return http 400

        const contactSendMessageDTO = {
            subject: "",
            message: "",
        };

        const response = await request(app.getHttpServer()).post("/contact").send(contactSendMessageDTO).expect(429);

        expect(response.body.success).toBeFalsy();
        expect(mockSMTP.sendMail).not.toHaveBeenCalled();
    });
});
