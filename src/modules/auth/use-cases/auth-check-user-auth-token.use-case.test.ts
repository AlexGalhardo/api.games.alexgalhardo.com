import { Test } from "@nestjs/testing";
import { User, UsersRepositoryPort } from "../../../repositories/users.repository";
import { AuthSignupUseCasePort } from "../use-cases/auth-register.use-case";
import { mock } from "jest-mock-extended";
import { AuthCheckUserAuthTokenUseCasePort } from "./auth-check-user-auth-token.use-case";
import { AuthSignupBodyDTO } from "src/modules/auth/dtos/auth-register.swagger";

describe("Test AuthSignupUseCase", () => {
	beforeAll(async () => {
		await Test.createTestingModule({
			controllers: [],
			providers: [
				{ provide: "UsersRepositoryPort", useValue: mock<UsersRepositoryPort>() },
				{ provide: "AuthSignupUseCasePort", useValue: mock<AuthSignupUseCasePort>() },
				{ provide: "AuthCheckUserAuthTokenUseCasePort", useValue: mock<AuthCheckUserAuthTokenUseCasePort>() },
			],
		}).compile();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should register a user", async () => {
		const authRegisterDTO = mock<AuthSignupBodyDTO>();
		const mockAuthRegisterUseCase = mock<AuthSignupUseCasePort>();
		mockAuthRegisterUseCase.execute.mockResolvedValueOnce({ success: true, auth_token: "jwttoken" });
		const response = await mockAuthRegisterUseCase.execute(authRegisterDTO);

		expect(response).toStrictEqual({
			success: true,
			auth_token: "jwttoken",
		});
	});

	it("should check auth token and return user", async () => {
		const mockAuthCheckUserJWTToken = mock<AuthCheckUserAuthTokenUseCasePort>();
		const mockUser = mock<User>();
		mockAuthCheckUserJWTToken.execute.mockResolvedValueOnce({ success: true, data: mockUser });

		const response = await mockAuthCheckUserJWTToken.execute("authtoken");

		expect(response).toStrictEqual({
			success: true,
			data: mockUser,
		});
	});
});
