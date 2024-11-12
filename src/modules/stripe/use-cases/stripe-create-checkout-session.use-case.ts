import { stripe } from "src/config/stripe.config";
import { UsersRepositoryPort } from "src/repositories/users.repository";
import { FRONT_END_URL } from "src/utils/constants.util";
import { ErrorsMessages } from "src/utils/errors-messages.util";

interface StripeCreateCheckoutSessionUseCaseResponse {
	success: boolean;
	redirect: string;
}

export interface StripeCreateCheckoutSessionDTO {
	lookup_key: string;
}

export interface StripeCreateCheckoutSessionUseCasePort {
	execute(
		user_id: string,
		stripeCreateCheckoutSessionDTO: StripeCreateCheckoutSessionDTO,
	): Promise<StripeCreateCheckoutSessionUseCaseResponse>;
}

export default class StripeCreateCheckoutSessionUseCase implements StripeCreateCheckoutSessionUseCasePort {
	constructor(private readonly usersRepository: UsersRepositoryPort) {}

	async execute(
		user_id: string,
		stripeCreateCheckoutSessionDTO: StripeCreateCheckoutSessionDTO,
	): Promise<StripeCreateCheckoutSessionUseCaseResponse> {
		const user = await this.usersRepository.findById(user_id);

		if (user) {
			if (user.stripe_subscription_active) throw new Error(ErrorsMessages.USER_HAS_ACTIVE_PLAN);

			const { lookup_key } = stripeCreateCheckoutSessionDTO;

			const prices = await stripe.prices.list({
				lookup_keys: [lookup_key],
				expand: ["data.product"],
			});

			const session = await stripe.checkout.sessions.create({
				billing_address_collection: "auto",
				line_items: [
					{
						price: prices.data[0].id,
						quantity: 1,
					},
				],
				mode: "subscription",
				success_url: `${FRONT_END_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${lookup_key.replace(
					"plan_",
					"",
				)}`,
				cancel_url: `${FRONT_END_URL}/pricing`,
			});

			return { success: true, redirect: session.url };
		}

		throw new Error(ErrorsMessages.USER_NOT_FOUND);
	}
}
