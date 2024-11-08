"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const stripe_config_1 = require("../../../config/stripe.config");
const constants_util_1 = require("../../../utils/constants.util");
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
class StripeCreateCheckoutSessionUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(jwtToken, stripeCreateCheckoutSessionDTO) {
        const { userID } = jwt.verify(jwtToken, process.env.JWT_SECRET);
        const { user } = await this.usersRepository.findById(userID);
        if (user) {
            if (user.stripe.subscription.active)
                throw new Error(errors_messages_util_1.ErrorsMessages.USER_HAS_ACTIVE_PLAN);
            const { lookup_key } = stripeCreateCheckoutSessionDTO;
            const prices = await stripe_config_1.stripe.prices.list({
                lookup_keys: [lookup_key],
                expand: ["data.product"],
            });
            const session = await stripe_config_1.stripe.checkout.sessions.create({
                billing_address_collection: "auto",
                line_items: [
                    {
                        price: prices.data[0].id,
                        quantity: 1,
                    },
                ],
                mode: "subscription",
                success_url: `${constants_util_1.FRONT_END_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${lookup_key.replace("plan_", "")}`,
                cancel_url: `${constants_util_1.FRONT_END_URL}/pricing`,
            });
            return { success: true, redirect: session.url };
        }
        throw new Error(errors_messages_util_1.ErrorsMessages.USER_NOT_FOUND);
    }
}
exports.default = StripeCreateCheckoutSessionUseCase;
//# sourceMappingURL=stripe-create-checkout-session.use-case.js.map