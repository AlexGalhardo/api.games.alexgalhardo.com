import { UsersRepositoryPort } from "../repositories/users.repository.js";
import { Bcrypt } from "../utils/bcrypt.util.js";
import { ErrorsMessages } from "../utils/errors-messages.util.js";
import { ClientException } from "../utils/exceptions.util.js";
import * as jwt from "jsonwebtoken";
import EmailValidator from "../validators/email.validator.js";
import PasswordValidator from "src/validators/password.validator.js";

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
	constructor(private readonly usersRepository: UsersRepositoryPort) { }

	async execute(authLoginPayload: AuthLoginDTO): Promise<UserLoginUseCaseResponse> {
		const { email, password } = authLoginPayload;

		if (email && !EmailValidator.validate(email)) throw new ClientException(ErrorsMessages.EMAIL_IS_INVALID);

		if (password && !PasswordValidator.validate(password)) throw new ClientException(ErrorsMessages.PASSWORD_IS_INVALID);

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
