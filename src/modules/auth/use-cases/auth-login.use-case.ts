import { getJWEKeysFromEnv } from "src/utils/get-jwe-keys-from-env.util";
import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { Bcrypt } from "../../../utils/bcrypt.util";
import { ErrorsMessages } from "../../../utils/errors-messages.util";
import { EmailValidator } from "../../../validators/email.validator";
import { PasswordValidator } from "src/validators/password.validator";
import { CompactEncrypt } from "jose";

export interface AuthLoginUseCasePort {
	execute(authLoginDTO: AuthLoginDTO): Promise<UserLoginUseCaseResponse>;
}

export interface AuthLoginDTO {
	email: string;
	password: string;
}

interface UserLoginUseCaseResponse {
	success: boolean;
	auth_token?: string;
	message?: string;
}

export default class AuthLoginUseCase implements AuthLoginUseCasePort {
	constructor(private readonly usersRepository: UsersRepositoryPort) {}

	async execute(authLoginPayload: AuthLoginDTO): Promise<UserLoginUseCaseResponse> {
		const { email, password } = authLoginPayload;

		if (email && !EmailValidator.validate(email)) throw new Error(ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);

		if (password && !PasswordValidator.validate(password))
			throw new Error(ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);

		if (email && password) {
			const { user, index } = await this.usersRepository.findByEmail(email);

			if (user) {
				if (!(await Bcrypt.compare(password, user.password))) {
					return { success: false, message: ErrorsMessages.EMAIL_OR_PASSWORD_INVALID };
				}

				const { JWE_PUBLIC_KEY } = await getJWEKeysFromEnv();
				const encoder = new TextEncoder();
				const encodedPayload = encoder.encode(JSON.stringify({ user_id: user?.id, user_email: email }));

				const auth_token = await new CompactEncrypt(encodedPayload)
					.setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
					.encrypt(JWE_PUBLIC_KEY);

				return { success: true, auth_token };
			}

			throw new Error(ErrorsMessages.USER_NOT_FOUND);
		}

		throw new Error(ErrorsMessages.EMAIL_OR_PASSWORD_INVALID);
	}
}
