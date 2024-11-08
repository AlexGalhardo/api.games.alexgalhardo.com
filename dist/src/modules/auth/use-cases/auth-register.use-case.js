"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionName = void 0;
const crypto_1 = require("crypto");
const bcrypt_util_1 = require("../../../utils/bcrypt.util");
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
const jwt = require("jsonwebtoken");
const generate_random_token_util_1 = require("../../../utils/generate-random-token.util");
const auth_register_validator_1 = require("../../../validators/auth-register.validator");
var SubscriptionName;
(function (SubscriptionName) {
    SubscriptionName["NOOB"] = "NOOB";
    SubscriptionName["CASUAL"] = "CASUAL";
    SubscriptionName["PRO"] = "PRO";
})(SubscriptionName || (exports.SubscriptionName = SubscriptionName = {}));
class AuthRegisterUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(authRegisterPayload) {
        var _a;
        console.log("authRegisterPayload -> ", authRegisterPayload);
        auth_register_validator_1.default.parse(authRegisterPayload);
        const { name, email, password } = authRegisterPayload;
        console.log("name, email, password -> ", name, email, password);
        const emailAlreadyRegistered = await this.usersRepository.findByEmail(email);
        console.log("emailAlreadyRegistered -> ", emailAlreadyRegistered);
        if (!emailAlreadyRegistered) {
            const userId = (0, crypto_1.randomUUID)();
            const jwt_token = jwt.sign({ userID: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
            console.log("jwt_token -> ", jwt_token);
            await this.usersRepository.create({
                id: userId,
                name,
                email,
                phone_number: (_a = authRegisterPayload.phone_number) !== null && _a !== void 0 ? _a : null,
                password: await bcrypt_util_1.Bcrypt.hash(password),
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
        throw new Error(errors_messages_util_1.ErrorsMessages.EMAIL_ALREADY_REGISTRED);
    }
}
exports.default = AuthRegisterUseCase;
//# sourceMappingURL=auth-register.use-case.js.map