import { randomUUID } from "crypto";
import { UsersRepositoryPort } from "../repositories/users.repository";
import { Bcrypt } from "../utils/bcrypt.util";
import { ErrorsMessages } from "../utils/errors-messages.util";
import * as jwt from "jsonwebtoken";
import GenerateRandomToken from "../utils/generate-random-token.util";
import AuthRegisterValidator from "src/validators/auth-register.validator";
import { AuthRegisterBodyDTO } from "src/swagger/auth-register.swagger";

interface AuthRegisterUseCaseResponse {
    success: boolean;
    jwt_token?: string;
}

export enum SubscriptionName {
    NOOB = "NOOB",
    CASUAL = "CASUAL",
    PRO = "PRO",
}

export interface AuthRegisterUseCasePort {
    execute(authRegisterPayload: AuthRegisterBodyDTO): Promise<AuthRegisterUseCaseResponse>;
}

export default class AuthRegisterUseCase implements AuthRegisterUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(authRegisterPayload: AuthRegisterBodyDTO): Promise<AuthRegisterUseCaseResponse> {
        AuthRegisterValidator.parse(authRegisterPayload);

        const { name, email, password } = authRegisterPayload;

        const emailAlreadyRegistered = await this.usersRepository.findByEmail(email);

        if (!emailAlreadyRegistered) {
            const userId = randomUUID();

            const jwt_token = jwt.sign({ userID: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

            await this.usersRepository.create({
                id: userId,
                name,
                email,
                telegram_number: authRegisterPayload.telegramNumber ?? null,
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
                        name: SubscriptionName.NOOB,
                        starts_at: null,
                        ends_at: null,
                        charge_id: null,
                        receipt_url: null,
                        hosted_invoice_url: null,
                    },
                    updated_at: null,
                },
                created_at: new Date(),
                updated_at: null,
                deleted_at: null,
            });

            return { success: true, jwt_token };
        }

        throw new Error(ErrorsMessages.EMAIL_ALREADY_REGISTRED);
    }
}
