import { randomUUID } from "crypto";
import { UsersRepositoryPort } from "../repositories/users.repository";
import { Bcrypt } from "../utils/bcrypt.util";
import { ErrorsMessages } from "../utils/errors-messages.util";
import * as jwt from "jsonwebtoken";
import DateTime from "../utils/date-time.util";
import GenerateRandomToken from "../utils/generate-random-token.util";
import AuthRegisterValidator from "src/validators/auth-register.validator";

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
    execute(authRegisterPayload: AuthRegisterDTO): Promise<AuthRegisterUseCaseResponse>;
}

export default class AuthRegisterUseCase implements AuthRegisterUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(authRegisterPayload: AuthRegisterDTO): Promise<AuthRegisterUseCaseResponse> {
        AuthRegisterValidator.parse(authRegisterPayload);

        const { username, email, telegramNumber, password } = authRegisterPayload;

        const emailAlreadyRegistred = await this.usersRepository.findByEmail(email);

        if (!emailAlreadyRegistred) {
            const userId = randomUUID();

            const jwt_token = jwt.sign({ userID: userId }, process.env.JWT_SECRET);

            await this.usersRepository.create({
                id: userId,
                username,
                email,
                telegram_number: telegramNumber,
                password: await Bcrypt.hash(password),
                jwt_token,
                api_key: GenerateRandomToken(),
                api_requests_today: 0,
                date_last_api_request: null,
                reset_password_token: null,
                reset_password_token_expires_at: null,
                stripe: {
                    customer_id: null,
                    subscription: {
                        active: false,
                        name: "NOOB",
                        starts_at: null,
                        ends_at: null,
                        charge_id: null,
                        receipt_url: null,
                        hosted_invoice_url: null,
                    },
                    updated_at: null,
                    updated_at_pt_br: null,
                },
                created_at: String(new Date()),
                updated_at: null,
                created_at_pt_br: DateTime.getNow(),
                updated_at_pt_br: null,
            });

            return { success: true, jwt_token };
        }

        throw new Error(ErrorsMessages.EMAIL_ALREADY_REGISTRED);
    }
}
