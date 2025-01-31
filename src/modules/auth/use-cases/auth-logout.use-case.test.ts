import { Test } from "@nestjs/testing";
import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { AuthSignupUseCasePort } from "./auth-signup.use-case";
import { mock } from "jest-mock-extended";
import { AuthLoginDTO, AuthLoginUseCasePort } from "../use-cases/auth-login.use-case";
import { AuthLogoutUseCasePort } from "../use-cases/auth-logout.use-case";
import { AuthSignupBodyDTO } from "src/modules/auth/dtos/auth-register.dto";
import { generateEmail } from "src/utils/generate-email.util";
import { generatePassword } from "src/utils/generate-password.util";
import { generatePhoneNumber } from "src/utils/generate-phone-number.util";

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

	const userEmail = generateEmail();
	const userPassword = generatePassword();
	let loginToken = null;

	it("should register a user", async () => {
		const authRegisterDTO = mock<AuthSignupBodyDTO>({
			name: "Testing Logout Test",
			email: userEmail,
			phone_number: generatePhoneNumber(),
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
