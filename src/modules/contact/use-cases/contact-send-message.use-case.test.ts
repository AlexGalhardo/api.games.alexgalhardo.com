import { Test } from "@nestjs/testing";
import { mock } from "jest-mock-extended";
import { SentMessageInfo, Transporter } from "nodemailer";
import ContactSendMessageUseCase, { ContactSendMessageDTO } from "./contact-send-message.use-case";

describe("ContactSendMessageUseCase", () => {
	let contactSendMessageUseCase: ContactSendMessageUseCase;
	const mockSMTP = mock<Transporter<SentMessageInfo>>();

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [ContactSendMessageUseCase, { provide: "SMTP", useValue: mockSMTP }],
		}).compile();

		contactSendMessageUseCase = moduleRef.get<ContactSendMessageUseCase>(ContactSendMessageUseCase);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should send an email successfully", async () => {
		const contactSendMessageDTO: ContactSendMessageDTO = {
			name: "John Doe",
			email: "john.doe@example.com",
			subject: "Test Subject",
			message: "This is a test message.",
		};

		const mockSentMessageInfo: SentMessageInfo = {
			accepted: ["aleexgvieira@gmail.com"],
			rejected: [],
			envelopeTime: 1000,
			messageTime: 1000,
			messageSize: 5000,
			response: "250 Message accepted",
			envelope: {
				from: process.env.SMTP_EMAIL_FROM,
				to: ["aleexgvieira@gmail.com"],
			},
			messageId: "test-message-id",
		};

		mockSMTP.sendMail.mockResolvedValueOnce(mockSentMessageInfo);

		const response = await contactSendMessageUseCase.execute(contactSendMessageDTO);

		expect(response).toStrictEqual({ success: true });
		expect(mockSMTP.sendMail).toHaveBeenCalledWith({
			from: process.env.SMTP_EMAIL_FROM,
			to: "aleexgvieira@gmail.com",
			subject: `NerdAPI: Message from john.doe@example.com: Test Subject`,
			html: expect.stringContaining(contactSendMessageDTO.message),
		});
	});

	it("should return success false when required fields are missing", async () => {
		const contactSendMessageDTO: ContactSendMessageDTO = {
			name: "",
			email: "",
			subject: "",
			message: "",
		};

		const response = await contactSendMessageUseCase.execute(contactSendMessageDTO);

		expect(response).toStrictEqual({ success: false });
		expect(mockSMTP.sendMail).not.toHaveBeenCalled();
	});
});
