import "dotenv/config";
import { randomUUID } from "crypto";
import { UserRepositoryPort } from "src/Repositories/Users.repository";
import { Bcrypt } from "src/Utils/Bcrypt";
import { ErrorsMessages } from "src/Utils/ErrorsMessages";
import { ClientException } from "src/Utils/Exception";
import Validator from "src/Utils/Validator";
import * as jwt from "jsonwebtoken";
import DateTime from "src/Utils/DataTypes/DateTime";

interface AuthRegisterUseCaseResponse {
    success: boolean;
    jwt_token?: string;
}

export interface AuthRegisterDTO {
    username: string;
    email: string;
    telegramNumber: string | null;
    password: string;
}

export interface AuthRegisterUseCasePort {
    execute(authRegisterDTO: AuthRegisterDTO): Promise<AuthRegisterUseCaseResponse>;
}

export default class AuthRegisterUseCase implements AuthRegisterUseCasePort {
    constructor(private readonly userRepository: UserRepositoryPort) {}

    async execute(authRegisterDTO: AuthRegisterDTO): Promise<AuthRegisterUseCaseResponse> {
        const { username, email, telegramNumber } = authRegisterDTO;
        const { password } = authRegisterDTO;
        let hashedPassword = null;

        if (!Validator.email.isValid(email)) throw new ClientException(ErrorsMessages.EMAIL_IS_INVALID);

        if (password) hashedPassword = await Bcrypt.hash(password);

        if (!this.userRepository.findByEmail(email)) {
            const userId = randomUUID();

            const jwt_token = jwt.sign({ userID: userId }, process.env.JWT_SECRET);

            this.userRepository.create({
                id: userId,
                username,
                email,
                telegram_number: telegramNumber,
                password: hashedPassword,
                jwt_token,
                api_token: null,
                reset_password_token: null,
                reset_password_token_expires_at: null,
                stripe: {
                    customer_id: null,
                    subscription: {
                        active: false,
                        starts_at: null,
                        ends_at: null,
                        transaction_id: null,
                    },
                },
                created_at: String(new Date()),
                updated_at: null,
                created_at_pt_br: DateTime.getNow(),
                updated_at_pt_br: null,
            });

            return { success: true, jwt_token };
        }

        throw new ClientException(ErrorsMessages.EMAIL_ALREADY_REGISTRED);
    }
}
