import { UsersRepositoryPort } from "../repositories/users.repository.js";
import { ErrorsMessages } from "../utils/errors-messages.util.js";
import { ClientException } from "../utils/exceptions.util.js";

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

        throw new ClientException(ErrorsMessages.RESET_PASSWORD_TOKEN_INVALID);
    }
}
