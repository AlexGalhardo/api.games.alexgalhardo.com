import { Test } from "@nestjs/testing";
import { mock } from "jest-mock-extended";
import { AuthRegisterDTO, AuthRegisterUseCasePort } from "../use-cases/auth-register.use-case.js";
import { ProfileUpdateUseCasePort } from "../use-cases/profile-update.use-case.js";
import { UserDeleteUseCasePort } from "../use-cases/user-delete.use-case.js";
import { ProfileUpdateDTO } from "../dtos/profile-update.dto.js";
import { UsersRepositoryPort } from "../repositories/users.repository.js";

describe("Test ProfileUpdateUseCase", () => {
    beforeAll(async () => {
        await Test.createTestingModule({
            controllers: [],
            providers: [
                { provide: "UsersRepositoryPort", useValue: mock<UsersRepositoryPort>() },
                { provide: "AuthRegisterUseCasePort", useValue: mock<AuthRegisterUseCasePort>() },
                { provide: "ProfileUpdateUseCasePort", useValue: mock<ProfileUpdateUseCasePort>() },
                { provide: "UserDeleteUseCasePort", useValue: mock<UserDeleteUseCasePort>() },
            ],
        }).compile();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should register a user", async () => {
        const authRegisterDTO = mock<AuthRegisterDTO>();
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
        const mockProfileUpdateDTO = mock<ProfileUpdateDTO>();
        mockProfileUpdateUseCase.execute.mockResolvedValueOnce({ success: true, data: mockProfileUpdateDTO });

        const response = await mockProfileUpdateUseCase.execute("jwttoken", mockProfileUpdateDTO);

        expect(response).toStrictEqual({
            success: true,
            data: mockProfileUpdateDTO,
        });
    });
});
