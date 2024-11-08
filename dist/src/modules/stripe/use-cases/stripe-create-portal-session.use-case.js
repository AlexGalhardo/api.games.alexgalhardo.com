"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_util_1 = require("../../../utils/constants.util");
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
const stripe_config_1 = require("../../../config/stripe.config");
const jwt = require("jsonwebtoken");
class StripeCreatePortalSessionUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(jwtToken, stripeCreatePortalSessionDTO) {
        const { userID } = jwt.verify(jwtToken, process.env.JWT_SECRET);
        const { user } = await this.usersRepository.findById(userID);
        if (user) {
            const { session_id } = stripeCreatePortalSessionDTO;
            const checkoutSession = await stripe_config_1.stripe.checkout.sessions.retrieve(session_id);
            const portalSession = await stripe_config_1.stripe.billingPortal.sessions.create({
                customer: checkoutSession.customer,
                return_url: `${constants_util_1.FRONT_END_URL}/profile`,
            });
            return { success: true, redirect: portalSession.url };
        }
        throw new Error(errors_messages_util_1.ErrorsMessages.USER_NOT_FOUND);
    }
}
exports.default = StripeCreatePortalSessionUseCase;
//# sourceMappingURL=stripe-create-portal-session.use-case.js.map