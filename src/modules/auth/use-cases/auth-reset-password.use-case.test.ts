import { Test } from "@nestjs/testing";
import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { AuthSignupUseCasePort } from "../use-cases/auth-register.use-case";
import { AuthForgetPasswordUseCasePort } from "../use-cases/auth-forget-password.use-case";
import { AuthResetPasswordDTO, AuthResetPasswordUseCasePort } from "../use-cases/auth-reset-password.use-case";
import { mock } from "jest-mock-extended";
import { randomUUID } from "node:crypto";
import { EmailValidator } from "src/validators/email.validator";
import { PasswordValidator } from "src/validators/password.validator";
import { AuthSignupBodyDTO } from "src/modules/auth/dtos/auth-register.swagger";

describe("Test AuthForgetPasswordUseCase", () => {
	beforeAll(async () => {
		await Test.createTestingModule({
			controllers: [],
			providers: [
				{ provide: "UsersRepositoryPort", useValue: mock<UsersRepositoryPort>() },
				{ provide: "AuthSignupUseCasePort", useValue: mock<AuthSignupUseCasePort>() },
				{ provide: "AuthForgetPasswordUseCasePort", useValue: mock<AuthForgetPasswordUseCasePort>() },
				{ provide: "AuthResetPasswordUseCasePort", useValue: mock<AuthResetPasswordUseCasePort>() },
			],
		}).compile();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const userEmail = EmailValidator.generate();
	let resetPasswordToken = null;

	it("should register a user", async () => {
		const authRegisterDTO = mock<AuthSignupBodyDTO>();
		const mockAuthRegisterUseCase = mock<AuthSignupUseCasePort>();
		mockAuthRegisterUseCase.execute.mockResolvedValueOnce({ success: true, auth_token: "authToken" });
		const { success, auth_token } = await mockAuthRegisterUseCase.execute(authRegisterDTO);

		expect(success).toBeTruthy();
		expect(auth_token).toBe("authToken");
	});

	it("should send a email with reset_password_token to user reset password", async () => {
		const mockAuthForgetPasswordUseCase = mock<AuthForgetPasswordUseCasePort>();

		mockAuthForgetPasswordUseCase.execute.mockResolvedValueOnce({
			success: true,
			reset_password_token: "resetpasswordtoken",
		});

		const { success, reset_password_token } = await mockAuthForgetPasswordUseCase.execute({ email: userEmail });

		resetPasswordToken = reset_password_token;

		expect(success).toBeTruthy();
		expect(reset_password_token).toBeDefined();
	});

	it("should get reset_password_token in url params and reset user password", async () => {
		const newPassword = PasswordValidator.generate();

		const mockAuthResetPasswordUseCase = mock<AuthResetPasswordUseCasePort>();

		mockAuthResetPasswordUseCase.execute.mockResolvedValueOnce({ success: true });

		const authResetPasswordDTO: AuthResetPasswordDTO = {
			newPassword,
			confirmNewPassword: newPassword,
		};
		const { success } = await mockAuthResetPasswordUseCase.execute(resetPasswordToken, authResetPasswordDTO);

		expect(success).toBeTruthy();
	});
});
