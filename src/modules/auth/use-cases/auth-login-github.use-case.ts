import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { Bcrypt } from "../../../utils/bcrypt.util";
import { Request } from "express";
import { randomUUID } from "node:crypto";
import { FRONT_END_URL } from "../../../utils/constants.util";
import GenerateRandomToken from "../../../utils/generate-random-token.util";
import { SubscriptionName } from "./auth-signup.use-case";
import { z } from "zod";
import createAuthToken from "src/utils/create-auth-token.util";

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
	auth_token?: string;
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

			z.string().email().parse(responseGithubProfileJSON.email);

			const user = await this.usersRepository.findByEmail(responseGithubProfileJSON.email);

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

				const auth_token = await createAuthToken(user);

				await this.usersRepository.create({
					id: userId,
					name: responseGithubProfileJSON.name,
					email: responseGithubProfileJSON.email,
					phone_number: null,
					password: await Bcrypt.hash(responseGithubProfileJSON.email),
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
