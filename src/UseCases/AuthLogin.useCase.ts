import { UsersRepositoryPort } from "src/Repositories/Users.repository";
import { Bcrypt } from "src/Utils/Bcrypt";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { ClientException } from "src/Utils/Exception";
import Validator from "src/Utils/Validator";
import * as jwt from "jsonwebtoken";

export interface AuthLoginUseCasePort {
    execute(authLoginDTO: AuthLoginDTO): Promise<UserLoginUseCaseResponse>;
}

export interface AuthLoginDTO {
    email: string;
    password: string;
}

interface UserLoginUseCaseResponse {
    success: boolean;
    jwt_token?: string;
    message?: string;
}

export default class AuthLoginUseCase implements AuthLoginUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(authLoginPayload: AuthLoginDTO): Promise<UserLoginUseCaseResponse> {
        const { email, password } = authLoginPayload;

        if (!Validator.email.isValid(email)) throw new ClientException(ErrorsMessages.EMAIL_IS_INVALID);

        if (email && password) {
            const { user, index } = await this.usersRepository.getByEmail(email);

            if (user) {
                if (!(await Bcrypt.compare(password, user.password))) {
                    return { success: false, message: ErrorsMessages.EMAIL_OR_PASSWORD_INVALID };
                }

                const jwt_token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET);
                user.jwt_token = jwt_token;
                await this.usersRepository.save(user, index);

                return { success: true, jwt_token };
            }

            throw new ClientException(ErrorsMessages.USER_NOT_FOUND);
        }

        throw new ClientException(ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);
    }
}
