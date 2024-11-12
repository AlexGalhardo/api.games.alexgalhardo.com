import { Test } from "@nestjs/testing";
import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { mock } from "jest-mock-extended";
import { AuthCheckResetPasswordTokenUseCasePort } from "../use-cases/auth-check-reset-password-token.use-case";
import { AuthSignupBodyDTO } from "src/modules/auth/dtos/auth-register.dto";
import { AuthSignupUseCasePort } from "./auth-signup.use-case";
import { AuthForgetPasswordDTO, AuthForgetPasswordUseCasePort } from "./auth-forget-password.use-case";

describe("Test AuthForgetPasswordUseCase", () => {
	beforeAll(async () => {
		await Test.createTestingModule({
			controllers: [],
			providers: [
				{ provide: "UsersRepositoryPort", useValue: mock<UsersRepositoryPort>() },
				{ provide: "AuthSignupUseCasePort", useValue: mock<AuthSignupUseCasePort>() },
				{ provide: "AuthForgetPasswordUseCasePort", useValue: mock<AuthForgetPasswordUseCasePort>() },
				{
					provide: "AuthCheckResetPasswordTokenUseCasePort",
					useValue: mock<AuthCheckResetPasswordTokenUseCasePort>(),
				},
			],
		}).compile();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should signup a user", async () => {
		const authRegisterDTO = mock<AuthSignupBodyDTO>();
		const mockAuthRegisterUseCase = mock<AuthSignupUseCasePort>();
		// const 'authToken' = jwt.sign({ user_id: randomUUID() }, "jwtsecret");
		mockAuthRegisterUseCase.execute.mockResolvedValueOnce({ success: true, auth_token: "jwttoken" });
		const { success, auth_token } = await mockAuthRegisterUseCase.execute(authRegisterDTO);

		expect(success).toBeTruthy();
		expect(auth_token).toBe("jwttoken");
	});

	it("should send a email with reset_password_token to user reset his password", async () => {
		const authForgetPasswordDTO = mock<AuthForgetPasswordDTO>();
		const mockAuthForgetPasswordUseCase = mock<AuthForgetPasswordUseCasePort>();
		mockAuthForgetPasswordUseCase.execute.mockResolvedValueOnce({
			success: true,
			reset_password_token: "resetpasswordtoken",
		});

		const response = await mockAuthForgetPasswordUseCase.execute(authForgetPasswordDTO);

		expect(response).toStrictEqual({
			success: true,
			reset_password_token: "resetpasswordtoken",
		});
	});

	it("should check if password reset token exists and is valid", async () => {
		const mockAuthCheckResetPasswordTokenUseCase = mock<AuthCheckResetPasswordTokenUseCasePort>();
		mockAuthCheckResetPasswordTokenUseCase.execute.mockResolvedValueOnce({ success: true });
		const { success } = await mockAuthCheckResetPasswordTokenUseCase.execute("userResetPasswordToken");

		expect(success).toBeTruthy();
	});
});
