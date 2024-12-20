import { randomUUID } from "crypto";
import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { Bcrypt } from "../../../utils/bcrypt.util";
import GenerateRandomToken from "../../../utils/generate-random-token.util";
import { AuthSignupBodyDTO } from "src/modules/auth/dtos/auth-register.dto";
import { AuthSignupValidator } from "src/validators/auth-signup.validator";
import createAuthToken from "src/utils/create-auth-token.util";

interface AuthSignupUseCaseResponse {
	success: boolean;
	auth_token?: string;
	error?: string;
}

export enum SubscriptionName {
	NOOB = "NOOB",
	CASUAL = "CASUAL",
	PRO = "PRO",
}

export interface AuthSignupUseCasePort {
	execute(payload: AuthSignupBodyDTO): Promise<AuthSignupUseCaseResponse>;
}

export default class AuthSignupUseCase implements AuthSignupUseCasePort {
	constructor(private readonly usersRepository: UsersRepositoryPort) {}

	async execute(payload: AuthSignupBodyDTO): Promise<AuthSignupUseCaseResponse> {
		AuthSignupValidator.parse(payload);

		const { name, email, password } = payload;

		const emailAlreadyRegistered = await this.usersRepository.findByEmail(email);

		if (!emailAlreadyRegistered) {
			try {
				const user_id = randomUUID();

				const auth_token = await createAuthToken({ id: user_id, email });

				await this.usersRepository.create({
					id: user_id,
					name,
					email,
					phone_number: payload?.phone_number ?? null,
					password: await Bcrypt.hash(password),
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

				return { success: true, auth_token: auth_token };
			} catch (error: any) {
				return { success: false, error: error?.message };
			}
		}

		return { success: false, error: "Email already registered" };
	}
}
