import { UsersRepositoryPort } from "src/repositories/users.repository";
import { FRONT_END_URL } from "src/utils/constants.util";
import { ErrorsMessages } from "src/utils/errors-messages.util";
import { stripe } from "src/config/stripe.config";

interface StripeCreatePortalSessionUseCaseResponse {
	success: boolean;
	redirect: string;
}

export interface StripeCreatePortalSessionDTO {
	session_id: string;
}

export interface StripeCreatePortalSessionUseCasePort {
	execute(
		user_id: string,
		stripeCreatePortalSessionDTO: StripeCreatePortalSessionDTO,
	): Promise<StripeCreatePortalSessionUseCaseResponse>;
}

export default class StripeCreatePortalSessionUseCase implements StripeCreatePortalSessionUseCasePort {
	constructor(private readonly usersRepository: UsersRepositoryPort) {}

	async execute(
		user_id: string,
		stripeCreatePortalSessionDTO: StripeCreatePortalSessionDTO,
	): Promise<StripeCreatePortalSessionUseCaseResponse> {
		const user = await this.usersRepository.findById(user_id);

		if (user) {
			const { session_id } = stripeCreatePortalSessionDTO;
			const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

			const portalSession = await stripe.billingPortal.sessions.create({
				customer: checkoutSession.customer as string,
				return_url: `${FRONT_END_URL}/profile`,
			});

			return { success: true, redirect: portalSession.url };
		}

		throw new Error(ErrorsMessages.USER_NOT_FOUND);
	}
}
