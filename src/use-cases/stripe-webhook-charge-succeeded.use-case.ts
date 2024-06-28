import DateTime from "../utils/date-time.util";
import { StripeRepositoryPort } from "../repositories/stripe.repository";
import { UsersRepositoryPort } from "../repositories/users.repository";
import { ErrorsMessages } from "../utils/errors-messages.util";
import GenerateRandomToken from "../utils/generate-random-token.util";

export interface StripeWebhookChargeSucceededUseCasePort {
	execute(event: any): void;
}

export default class StripeWebhookChargeSucceededUseCase implements StripeWebhookChargeSucceededUseCasePort {
	constructor(
		private readonly stripeRepository: StripeRepositoryPort,
		private readonly usersRepository: UsersRepositoryPort,
	) { }

	async execute(event: any) {
		const { user } = await this.usersRepository.findByEmail(event.data.object.billing_details.email);

		if (user) {
			await this.usersRepository.updateStripeSubscriptionInfo(user, {
				apiToken: event.data.object.paid ? GenerateRandomToken() : null,
				customerId: event.data.object.customer ?? null,
				paid: event.data.object.paid ?? null,
				chargeId: event.data.object.id ?? null,
				amount: event.data.object.amount,
				receiptUrl: event.data.object.receipt_url ?? null,
				createdAt: String(new Date(event.created)),
				createdAtBrazil: DateTime.timestampToGetNow(event.created) ?? null,
			});

			this.stripeRepository.saveChargeWebhookEventLog(event);
		} else {
			throw new Error(ErrorsMessages.USER_NOT_FOUND);
		}
	}
}
