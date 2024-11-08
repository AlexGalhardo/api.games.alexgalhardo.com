"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telegram_logger_config_1 = require("../../../config/telegram-logger.config");
const date_time_util_1 = require("../../../utils/date-time.util");
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
class StripeWebhookInvoiceFinalizedUseCase {
    constructor(stripeRepository, usersRepository) {
        this.stripeRepository = stripeRepository;
        this.usersRepository = usersRepository;
    }
    async execute(event) {
        var _a, _b, _c, _d, _e, _f;
        const { user } = await this.usersRepository.findByEmail(event.data.object.customer_email);
        if (user) {
            const userUpdated = await this.usersRepository.updateStripeSubscriptionInfo(user, {
                customerId: (_a = event.data.object.customer) !== null && _a !== void 0 ? _a : null,
                invoiceId: (_b = event.data.object.id) !== null && _b !== void 0 ? _b : null,
                hostedInvoiceUrl: (_c = event.data.object.hosted_invoice_url) !== null && _c !== void 0 ? _c : null,
                amount: event.data.object.amount_due,
                startAt: (_d = date_time_util_1.default.timestampToGetNow(event.data.object.lines.data[0].period.start)) !== null && _d !== void 0 ? _d : null,
                endsAt: (_e = date_time_util_1.default.timestampToGetNow(event.data.object.lines.data[0].period.end)) !== null && _e !== void 0 ? _e : null,
                createdAt: String(new Date(event.created)),
                createdAtBrazil: (_f = date_time_util_1.default.timestampToGetNow(event.created)) !== null && _f !== void 0 ? _f : null,
            });
            this.stripeRepository.saveInvoiceWebhookEventLog(event);
            telegram_logger_config_1.default.info(`\n
            	<b>STRIPE CHARGE ID:</b> ${userUpdated.stripe.subscription.charge_id}
            	<b>STRIPE CHARGE PAID:</b> ${userUpdated.stripe.subscription.active}
            	<b>STRIPE RECEIPT URL:</b> ${userUpdated.stripe.subscription.receipt_url}
            	<b>STRIPE INVOICE URL:</b> ${userUpdated.stripe.subscription.hosted_invoice_url}
            	---------------------------------------------
            	<b>SUBSCRIPTION NAME:</b> ${userUpdated.stripe.subscription.name}
            	<b>SUBSCRIPTION AMOUNT:</b> ${userUpdated.stripe.subscription.name === "CASUAL" ? 199 : 499}
            	<b>SUBSCRIPTION START AT:</b> ${userUpdated.stripe.subscription.starts_at}
            	<b>SUBSCRIPTION ENDS AT:</b> ${userUpdated.stripe.subscription.ends_at}
            	---------------------------------------------
            	<b>STRIPE CUSTOMER ID:</b> ${userUpdated.stripe.customer_id}
            	<b>CUSTOMER NAME:</b> ${userUpdated.name}
            	<b>CUSTOMER EMAIL:</b> ${userUpdated.email}
            	<b>CUSTOMER SUBSCRIPTION ACTIVE: </b> ${userUpdated.stripe.subscription.active}
            	<b>CUSTOMER API TOKEN: </b> ${userUpdated.api_key}
            	`);
        }
        else {
            throw new Error(errors_messages_util_1.ErrorsMessages.USER_NOT_FOUND);
        }
    }
}
exports.default = StripeWebhookInvoiceFinalizedUseCase;
//# sourceMappingURL=stripe-webhook-invoice-finalized.use-case.js.map