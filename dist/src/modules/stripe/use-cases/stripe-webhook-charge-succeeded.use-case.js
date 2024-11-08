"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_time_util_1 = require("../../../utils/date-time.util");
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
const generate_random_token_util_1 = require("../../../utils/generate-random-token.util");
class StripeWebhookChargeSucceededUseCase {
    constructor(stripeRepository, usersRepository) {
        this.stripeRepository = stripeRepository;
        this.usersRepository = usersRepository;
    }
    async execute(event) {
        var _a, _b, _c, _d, _e;
        const { user } = await this.usersRepository.findByEmail(event.data.object.billing_details.email);
        if (user) {
            await this.usersRepository.updateStripeSubscriptionInfo(user, {
                apiToken: event.data.object.paid ? (0, generate_random_token_util_1.default)() : null,
                customerId: (_a = event.data.object.customer) !== null && _a !== void 0 ? _a : null,
                paid: (_b = event.data.object.paid) !== null && _b !== void 0 ? _b : null,
                chargeId: (_c = event.data.object.id) !== null && _c !== void 0 ? _c : null,
                amount: event.data.object.amount,
                receiptUrl: (_d = event.data.object.receipt_url) !== null && _d !== void 0 ? _d : null,
                createdAt: String(new Date(event.created)),
                createdAtBrazil: (_e = date_time_util_1.default.timestampToGetNow(event.created)) !== null && _e !== void 0 ? _e : null,
            });
            this.stripeRepository.saveChargeWebhookEventLog(event);
        }
        else {
            throw new Error(errors_messages_util_1.ErrorsMessages.USER_NOT_FOUND);
        }
    }
}
exports.default = StripeWebhookChargeSucceededUseCase;
//# sourceMappingURL=stripe-webhook-charge-succeeded.use-case.js.map