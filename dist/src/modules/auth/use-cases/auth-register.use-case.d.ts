import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { AuthRegisterBodyDTO } from "src/modules/auth/dtos/auth-register.swagger";
interface AuthRegisterUseCaseResponse {
    success: boolean;
    jwt_token?: string;
}
export declare enum SubscriptionName {
    NOOB = "NOOB",
    CASUAL = "CASUAL",
    PRO = "PRO"
}
export interface AuthRegisterUseCasePort {
    execute(authRegisterPayload: AuthRegisterBodyDTO): Promise<AuthRegisterUseCaseResponse>;
}
export default class AuthRegisterUseCase implements AuthRegisterUseCasePort {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepositoryPort);
    execute(authRegisterPayload: AuthRegisterBodyDTO): Promise<AuthRegisterUseCaseResponse>;
}
export {};
