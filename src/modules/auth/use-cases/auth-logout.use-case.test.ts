import { Test } from "@nestjs/testing";
import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { AuthSignupUseCasePort } from "../use-cases/auth-register.use-case";
import { mock } from "jest-mock-extended";
import { AuthLoginDTO, AuthLoginUseCasePort } from "../use-cases/auth-login.use-case";
import { AuthLogoutUseCasePort } from "../use-cases/auth-logout.use-case";
import { AuthSignupBodyDTO } from "src/modules/auth/dtos/auth-register.swagger";
import { EmailValidator } from "src/validators/email.validator";
import { PasswordValidator } from "src/validators/password.validator";
import { PhoneValidator } from "src/validators/phone.validator";

describe("Test AuthLogoutUseCase", () => {
	beforeAll(async () => {
		await Test.createTestingModule({
			controllers: [],
			providers: [
				{ provide: "UsersRepositoryPort", useValue: mock<UsersRepositoryPort>() },
				{ provide: "AuthSignupUseCasePort", useValue: mock<AuthSignupUseCasePort>() },
				{ provide: "AuthLoginUseCasePort", useValue: mock<AuthLoginUseCasePort>() },
				{ provide: "AuthLogoutUseCasePort", useValue: mock<AuthLogoutUseCasePort>() },
			],
		}).compile();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const userEmail = EmailValidator.generate();
	const userPassword = PasswordValidator.generate();
	let loginToken = null;

	it("should register a user", async () => {
		const authRegisterDTO = mock<AuthSignupBodyDTO>({
			name: "Testing Logout Test",
			email: userEmail,
			phone_number: PhoneValidator.generate(),
			password: userPassword,
		});
		const mockAuthRegisterUseCase = mock<AuthSignupUseCasePort>();
		mockAuthRegisterUseCase.execute.mockResolvedValueOnce({ success: true, auth_token: "authToken" });
		const { success, auth_token } = await mockAuthRegisterUseCase.execute(authRegisterDTO);

		expect(success).toBeTruthy();
		expect(auth_token).toBe("authToken");
	});

	it("should login a user", async () => {
		const mockAuthLoginDTO = mock<AuthLoginDTO>({
			email: userEmail,
			password: userPassword,
		});
		const mockAuthLoginUseCasePort = mock<AuthLoginUseCasePort>();
		mockAuthLoginUseCasePort.execute.mockResolvedValueOnce({ success: true, auth_token: "jwtotken" });

		let response = await mockAuthLoginUseCasePort.execute(mockAuthLoginDTO);

		loginToken = response.auth_token;

		expect(response).toStrictEqual({
			success: true,
			auth_token: loginToken,
		});
	});

	it("should logout a user", async () => {
		const mockAuthLogoutUseCasePort = mock<AuthLogoutUseCasePort>();
		mockAuthLogoutUseCasePort.execute.mockResolvedValueOnce({ success: true });
		const { success } = await mockAuthLogoutUseCasePort.execute(loginToken);

		expect(success).toBeTruthy();
	});
});
