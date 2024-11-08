import { Test } from "@nestjs/testing";
import { mock } from "jest-mock-extended";
import { AuthRegisterUseCasePort } from "../../auth/use-cases/auth-register.use-case";
import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { AuthRegisterBodyDTO } from "src/modules/auth/dtos/auth-register.swagger";
import { ProfileUpdateBodyDTO } from "src/modules/profile/dtos/profile-update.swagger";
import { ProfileUpdateUseCasePort } from "./profile-update.use-case";
import { ProfileDeleteUseCasePort } from "./profile-delete.use-case";

describe("Test ProfileUpdateUseCase", () => {
	beforeAll(async () => {
		await Test.createTestingModule({
			controllers: [],
			providers: [
				{ provide: "UsersRepositoryPort", useValue: mock<UsersRepositoryPort>() },
				{ provide: "AuthRegisterUseCasePort", useValue: mock<AuthRegisterUseCasePort>() },
				{ provide: "ProfileUpdateUseCasePort", useValue: mock<ProfileUpdateUseCasePort>() },
				{ provide: "ProfileDeleteUseCasePort", useValue: mock<ProfileDeleteUseCasePort>() },
			],
		}).compile();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should register a user", async () => {
		const authRegisterDTO = mock<AuthRegisterBodyDTO>();
		const mockAuthRegisterUseCase = mock<AuthRegisterUseCasePort>();
		mockAuthRegisterUseCase.execute.mockResolvedValueOnce({ success: true, jwt_token: "jwttoken" });
		const response = await mockAuthRegisterUseCase.execute(authRegisterDTO);

		expect(response).toStrictEqual({
			success: true,
			jwt_token: "jwttoken",
		});
	});

	it("should update profile", async () => {
		const mockProfileUpdateUseCase = mock<ProfileUpdateUseCasePort>();
		const mockProfileUpdateDTO = mock<ProfileUpdateBodyDTO>();
		mockProfileUpdateUseCase.execute.mockResolvedValueOnce({ success: true, data: mockProfileUpdateDTO });

		const response = await mockProfileUpdateUseCase.execute("jwttoken", mockProfileUpdateDTO);

		expect(response).toStrictEqual({
			success: true,
			data: mockProfileUpdateDTO,
		});
	});
});
