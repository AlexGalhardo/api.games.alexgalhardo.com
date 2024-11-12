import { Test } from "@nestjs/testing";
import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { AuthSignupUseCasePort } from "../use-cases/auth-signup.use-case";
import { mock } from "jest-mock-extended";
import { AuthSignupBodyDTO } from "src/modules/auth/dtos/auth-register.dto";

describe("Test AuthSignupUseCase", () => {
	beforeAll(async () => {
		await Test.createTestingModule({
			controllers: [],
			providers: [
				{ provide: "UsersRepositoryPort", useValue: mock<UsersRepositoryPort>() },
				{ provide: "AuthSignupUseCasePort", useValue: mock<AuthSignupUseCasePort>() },
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
});
