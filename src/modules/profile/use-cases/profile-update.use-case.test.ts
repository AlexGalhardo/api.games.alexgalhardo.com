import { Test } from "@nestjs/testing";
import { mock } from "jest-mock-extended";
import { AuthSignupUseCasePort } from "../../auth/use-cases/auth-signup.use-case";
import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { AuthSignupBodyDTO } from "src/modules/auth/dtos/auth-register.dto";
import { ProfileUpdateDTO } from "src/modules/profile/dtos/profile-update.dto";
import { ProfileUpdateUseCasePort } from "./profile-update.use-case";
import { ProfileDeleteUseCasePort } from "./profile-delete.use-case";

describe("Test ProfileUpdateUseCase", () => {
	beforeAll(async () => {
		await Test.createTestingModule({
			controllers: [],
			providers: [
				{ provide: "UsersRepositoryPort", useValue: mock<UsersRepositoryPort>() },
				{ provide: "AuthSignupUseCasePort", useValue: mock<AuthSignupUseCasePort>() },
				{ provide: "ProfileUpdateUseCasePort", useValue: mock<ProfileUpdateUseCasePort>() },
				{ provide: "ProfileDeleteUseCasePort", useValue: mock<ProfileDeleteUseCasePort>() },
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

	it("should update profile", async () => {
		const mockProfileUpdateUseCase = mock<ProfileUpdateUseCasePort>();
		const mockProfileUpdateDTO = mock<ProfileUpdateDTO>();
		mockProfileUpdateUseCase.execute.mockResolvedValueOnce({ success: true, data: mockProfileUpdateDTO });

		const response = await mockProfileUpdateUseCase.execute("jwttoken", mockProfileUpdateDTO);

		expect(response).toStrictEqual({
			success: true,
			data: mockProfileUpdateDTO,
		});
	});
});
