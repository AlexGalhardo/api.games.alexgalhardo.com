"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_util_1 = require("../../../utils/bcrypt.util");
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
const jwt = require("jsonwebtoken");
const node_crypto_1 = require("node:crypto");
const constants_util_1 = require("../../../utils/constants.util");
const generate_random_token_util_1 = require("../../../utils/generate-random-token.util");
const auth_register_use_case_1 = require("./auth-register.use-case");
const email_validator_1 = require("../../../validators/email.validator");
class AuthLoginGitHubUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(request) {
        try {
            const requestToken = String(request.query.code);
            const githubResponse = await fetch(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${requestToken}`, {
                method: "POST",
                headers: {
                    accept: "application/json",
                },
            });
            const githubResponseJson = await githubResponse.json();
            const responseGithubProfile = await fetch(`https://api.github.com/user`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${githubResponseJson.access_token}`,
                },
            });
            const responseGithubProfileJSON = await responseGithubProfile.json();
            if (!email_validator_1.default.validate(responseGithubProfileJSON.email))
                throw new Error(errors_messages_util_1.ErrorsMessages.EMAIL_INVALID);
            const userExists = await this.usersRepository.findByEmail(responseGithubProfileJSON.email);
            if (userExists) {
                const { user, index } = await this.usersRepository.findByEmail(responseGithubProfileJSON.email);
                const jwt_token = jwt.sign({ userID: user.id }, process.env.JWT_SECRET);
                user.jwt_token = jwt_token;
                await this.usersRepository.save(user, index);
                return {
                    success: true,
                    jwt_token,
                    redirect: `${constants_util_1.FRONT_END_URL}/profile?token=${jwt_token}&registred=${false}`,
                };
            }
            else {
                const userId = (0, node_crypto_1.randomUUID)();
                const jwt_token = jwt.sign({ userID: userId }, process.env.JWT_SECRET);
                await this.usersRepository.create({
                    id: userId,
                    name: responseGithubProfileJSON.name,
                    email: responseGithubProfileJSON.email,
                    phone_number: null,
                    password: await bcrypt_util_1.Bcrypt.hash(responseGithubProfileJSON.email),
                    jwt_token,
                    api_key: (0, generate_random_token_util_1.default)(),
                    api_requests_today: 0,
                    date_last_api_request: null,
                    reset_password_token: null,
                    reset_password_token_expires_at: null,
                    stripe: {
                        customer_id: null,
                        subscription: {
                            active: false,
                            name: auth_register_use_case_1.SubscriptionName.NOOB,
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
                    jwt_token,
                    redirect: `${constants_util_1.FRONT_END_URL}/profile?token=${jwt_token}&registred=${true}`,
                };
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
exports.default = AuthLoginGitHubUseCase;
//# sourceMappingURL=auth-login-github.use-case.js.map