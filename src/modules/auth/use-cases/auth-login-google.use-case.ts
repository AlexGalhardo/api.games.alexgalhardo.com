import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { Bcrypt } from "../../../utils/bcrypt.util";
import { Request } from "express";
import { OAuth2Client } from "google-auth-library";
import { randomUUID } from "node:crypto";
import { FRONT_END_URL } from "../../../utils/constants.util";
import GenerateRandomToken from "../../../utils/generate-random-token.util";
import { SubscriptionName } from "./auth-signup.use-case";
import { getJWEKeysFromEnv } from "src/utils/get-jwe-keys-from-env.util";
import { CompactEncrypt } from "jose";
import { z } from "zod";
import createAuthToken from "src/utils/create-auth-token.util";

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
	auth_token?: string;
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

			z.string().email().parse(email);

			const user = await this.usersRepository.findByEmail(email);

			if (user) {
				const auth_token = await createAuthToken(user);

				await this.usersRepository.updateAuthToken(user.id, auth_token);

				return {
					success: true,
					auth_token,
					redirect: `${FRONT_END_URL}/profile?token=${auth_token}&registered=${false}`,
				};
			} else {
				const userId = randomUUID();

				const auth_token = await createAuthToken({ id: userId, email });

				await this.usersRepository.create({
					id: userId,
					name: name,
					email,
					phone_number: null,
					password: await Bcrypt.hash(email),
					auth_token,
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

				return {
					success: true,
					auth_token,
					redirect: `${FRONT_END_URL}/profile?token=${auth_token}&registered=${true}`,
				};
			}
		} catch (error: any) {
			throw new Error(error);
		}
	}
}
