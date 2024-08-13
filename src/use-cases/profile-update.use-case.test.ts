import { Test } from "@nestjs/testing";
import { mock } from "jest-mock-extended";
import { AuthRegisterUseCasePort } from "../use-cases/auth-register.use-case";
import { ProfileUpdateUseCasePort } from "../use-cases/profile-update.use-case";
import { UserDeleteUseCasePort } from "../use-cases/user-delete.use-case";
import { UsersRepositoryPort } from "../repositories/users.repository";
import { SwaggerAuthRegisterBodyDTO } from "src/swagger/auth-register.swagger";
import { SwaggerProfileUpdateBodyDTO } from "src/swagger/profile-update.swagger";

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
        const authRegisterDTO = mock<SwaggerAuthRegisterBodyDTO>();
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
        const mockProfileUpdateDTO = mock<SwaggerProfileUpdateBodyDTO>();
        mockProfileUpdateUseCase.execute.mockResolvedValueOnce({ success: true, data: mockProfileUpdateDTO });

        const response = await mockProfileUpdateUseCase.execute("jwttoken", mockProfileUpdateDTO);

        expect(response).toStrictEqual({
            success: true,
            data: mockProfileUpdateDTO,
        });
    });
});
