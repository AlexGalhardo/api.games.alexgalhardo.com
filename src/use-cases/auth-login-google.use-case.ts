import { UsersRepositoryPort } from "../repositories/users.repository.js";
import { Bcrypt } from "../utils/bcrypt.util.js";
import { ErrorsMessages } from "../utils/errors-messages.util.js";
import { ClientException } from "../utils/exceptions.util.js";
import * as jwt from "jsonwebtoken";
import { Request } from "express";
import { OAuth2Client } from "google-auth-library";
import { randomUUID } from "node:crypto";
import { APP_URL } from "../utils/constants.util.js";
import GenerateRandomToken from "../utils/generate-random-token.util.js";
import { SubscriptionName } from "./auth-register.use-case.js";
import emailValidator from "../validators/email.validator.js";
import DateTime from "../utils/date-time.util.js";

export interface AuthLoginGoogleUseCasePort {
    execute(request: Request): Promise<AuthLoginGoogleUseCaseResponse>;
}

export interface AuthLoginDTO {
    email: string;
    password: string;
}

interface AuthLoginGoogleUseCaseResponse {
    success: boolean;
    redirect: string;
    jwt_token?: string;
}

export default class AuthLoginGoogleUseCase implements AuthLoginGoogleUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(request: Request): Promise<AuthLoginGoogleUseCaseResponse> {
        const { credential } = request.body;

        try {
            const googleResponse = await new OAuth2Client().verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = googleResponse.getPayload();
            const { email, name } = payload;

            if (!emailValidator.validate(email)) throw new ClientException(ErrorsMessages.EMAIL_IS_INVALID);

            const userExists = await this.usersRepository.findByEmail(email);

            if (userExists) {
                const { user, index } = await this.usersRepository.getByEmail(email);
                const jwt_token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET);
                user.jwt_token = jwt_token;
                await this.usersRepository.save(user, index);

                return {
                    success: true,
                    jwt_token,
                    redirect: `${APP_URL}/profile?token=${jwt_token}&registred=${false}`,
                };
            } else {
                const userId = randomUUID();

                const jwt_token = jwt.sign({ userID: userId }, process.env.JWT_SECRET);

                await this.usersRepository.create({
                    id: userId,
                    username: name,
                    email,
                    telegram_number: null,
                    password: await Bcrypt.hash(email),
                    jwt_token,
                    api_key: GenerateRandomToken(),
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
                        updated_at_pt_br: null,
                    },
                    created_at: String(new Date()),
                    updated_at: null,
                    created_at_pt_br: DateTime.getNow(),
                    updated_at_pt_br: null,
                });

                return {
                    success: true,
                    jwt_token,
                    redirect: `${APP_URL}/profile?token=${jwt_token}&registred=${true}`,
                };
            }
        } catch (error: any) {
            throw new ClientException(error);
        }
    }
}
