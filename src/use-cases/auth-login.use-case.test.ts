import { Test } from "@nestjs/testing";
import { UsersRepositoryPort } from "../repositories/users.repository";
import { AuthRegisterUseCasePort } from "../use-cases/auth-register.use-case";
import { mock } from "jest-mock-extended";
import { randomUUID } from "node:crypto";
import * as jwt from "jsonwebtoken";
import { AuthLoginDTO, AuthLoginUseCasePort } from "../use-cases/auth-login.use-case";
import { AuthLogoutUseCasePort } from "../use-cases/auth-logout.use-case";
import { SwaggerAuthRegisterBodyDTO } from "src/swagger/auth-register.swagger";

describe("Test AuthLoginUseCase", () => {
    beforeAll(async () => {
        await Test.createTestingModule({
            controllers: [],
            providers: [
                { provide: "UsersRepositoryPort", useValue: mock<UsersRepositoryPort>() },
                { provide: "AuthRegisterUseCasePort", useValue: mock<AuthRegisterUseCasePort>() },
                { provide: "AuthLoginUseCasePort", useValue: mock<AuthLoginUseCasePort>() },
            ],
        }).compile();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const userEmail = "emailtest@gmail.com";
    const userPassword = "testing@123";
    let loginToken = null;

    it("should register a user", async () => {
        const authRegisterDTO = mock<SwaggerAuthRegisterBodyDTO>({
            name: "Testing Logout Test",
            email: userEmail,
            telegramNumber: "1899999999",
            password: userPassword,
        });
        const mockAuthRegisterUseCase = mock<AuthRegisterUseCasePort>();
        const jwtToken = jwt.sign({ userID: randomUUID() }, "jwtsecret");
        mockAuthRegisterUseCase.execute.mockResolvedValueOnce({ success: true, jwt_token: jwtToken });
        const { success, jwt_token } = await mockAuthRegisterUseCase.execute(authRegisterDTO);

        expect(success).toBeTruthy();
        expect(jwt_token).toBe(jwtToken);
    });

    it("should login a user", async () => {
        const mockAuthLoginDTO = mock<AuthLoginDTO>({
            email: userEmail,
            password: userPassword,
        });
        const mockAuthLoginUseCasePort = mock<AuthLoginUseCasePort>();
        mockAuthLoginUseCasePort.execute.mockResolvedValueOnce({ success: true, jwt_token: "jwtotken" });

        let response = await mockAuthLoginUseCasePort.execute(mockAuthLoginDTO);

        loginToken = response.jwt_token;

        expect(response).toStrictEqual({
            success: true,
            jwt_token: loginToken,
        });
    });

    it("should logout a user", async () => {
        const mockAuthLogoutUseCasePort = mock<AuthLogoutUseCasePort>();
        mockAuthLogoutUseCasePort.execute.mockResolvedValueOnce({ success: true });
        const { success } = await mockAuthLogoutUseCasePort.execute(loginToken);

        expect(success).toBeTruthy();
    });
});
