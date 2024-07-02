import { UsersRepositoryPort } from "../repositories/users.repository";
import { Bcrypt } from "../utils/bcrypt.util";
import { ErrorsMessages } from "../utils/errors-messages.util";
import * as jwt from "jsonwebtoken";
import { Request } from "express";
import { randomUUID } from "node:crypto";
import { APP_URL } from "../utils/constants.util";
import GenerateRandomToken from "../utils/generate-random-token.util";
import emailValidator from "../validators/email.validator";
import DateTime from "../utils/date-time.util";

export interface AuthLoginGitHubUseCasePort {
    execute(request: Request): Promise<AuthLoginGitHubUseCaseResponse>;
}

export interface AuthLoginDTO {
    email: string;
    password: string;
}

interface AuthLoginGitHubUseCaseResponse {
    success: boolean;
    redirect: string;
    jwt_token?: string;
}

export default class AuthLoginGitHubUseCase implements AuthLoginGitHubUseCasePort {
    constructor(private readonly usersRepository: UsersRepositoryPort) {}

    async execute(request: Request): Promise<AuthLoginGitHubUseCaseResponse> {
        try {
            const requestToken = String(request.query.code);

            const githubResponse = await fetch(
                `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${requestToken}`,
                {
                    method: "POST",
                    headers: {
                        accept: "application/json",
                    },
                },
            );

            const githubResponseJson = await githubResponse.json();

            const responseGithubProfile = await fetch(`https://api.github.com/user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${githubResponseJson.access_token}`,
                },
            });

            const responseGithubProfileJSON = await responseGithubProfile.json();

            if (!emailValidator.validate(responseGithubProfileJSON.email))
                throw new Error(ErrorsMessages.EMAIL_INVALID);

            const userExists = await this.usersRepository.findByEmail(responseGithubProfileJSON.email);

            if (userExists) {
                const { user, index } = await this.usersRepository.findByEmail(responseGithubProfileJSON.email);
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
                    username: responseGithubProfileJSON.name,
                    email: responseGithubProfileJSON.email,
                    telegram_number: null,
                    password: await Bcrypt.hash(responseGithubProfileJSON.email),
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

                return {
                    success: true,
                    jwt_token,
                    redirect: `${APP_URL}/profile?token=${jwt_token}&registred=${true}`,
                };
            }
        } catch (error: any) {
            throw new Error(error);
        }
    }
}
