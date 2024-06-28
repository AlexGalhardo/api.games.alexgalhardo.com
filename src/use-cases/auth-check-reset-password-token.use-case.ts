import { UsersRepositoryPort } from "../repositories/users.repository";
import { ErrorsMessages } from "../utils/errors-messages.util";
import { Error } from "../utils/exceptions.util";

export interface CheckResetPasswordTokenDTO {
    resetPasswordToken: string;
}

export interface AuthCheckResetPasswordTokenUseCasePort {
    execute(resetPasswordToken: string): Promise<AuthCheckResetPasswordTokenUseCaseResponse>;
}

interface AuthCheckResetPasswordTokenUseCaseResponse {
    success: boolean;
}

export default class AuthCheckResetPasswordTokenUseCase implements AuthCheckResetPasswordTokenUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(resetPasswordToken: string): Promise<AuthCheckResetPasswordTokenUseCaseResponse> {
        const resetPasswordTokenExist = await this.usersRepository.findResetPasswordToken(resetPasswordToken);

        if (resetPasswordTokenExist) return { success: true };

        throw new Error(ErrorsMessages.RESET_PASSWORD_TOKEN_INVALID);
    }
}
