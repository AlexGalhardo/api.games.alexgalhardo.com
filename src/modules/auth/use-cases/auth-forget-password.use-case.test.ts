import { Test } from "@nestjs/testing";
import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { AuthSignupUseCasePort } from "./auth-signup.use-case";
import { mock } from "jest-mock-extended";
import { AuthForgetPasswordDTO, AuthForgetPasswordUseCasePort } from "../use-cases/auth-forget-password.use-case";
import { AuthSignupBodyDTO } from "src/modules/auth/dtos/auth-register.dto";

describe("Test AuthForgetPasswordUseCase", () => {
	beforeAll(async () => {
		await Test.createTestingModule({
			controllers: [],
			providers: [
				{ provide: "UsersRepositoryPort", useValue: mock<UsersRepositoryPort>() },
				{ provide: "AuthSignupUseCasePort", useValue: mock<AuthSignupUseCasePort>() },
				{ provide: "AuthForgetPasswordUseCasePort", useValue: mock<AuthForgetPasswordUseCasePort>() },
			],
		}).compile();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should register a user", async () => {
		const authRegisterDTO = mock<AuthSignupBodyDTO>();
		const mockAuthRegisterUseCase = mock<AuthSignupUseCasePort>();
		mockAuthRegisterUseCase.execute.mockResolvedValueOnce({ success: true, auth_token: "authToken" });
		const { success, auth_token } = await mockAuthRegisterUseCase.execute(authRegisterDTO);

		expect(success).toBeTruthy();
		expect(auth_token).toBe("authToken");
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
});
