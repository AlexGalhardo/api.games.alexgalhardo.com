import { Module } from "@nestjs/common";
import StripeRepository, { StripeRepositoryPort } from "../../repositories/stripe.repository";
import UsersRepository, { UsersRepositoryPort } from "../../repositories/users.repository";
import { Database } from "../../config/database.config";
import { StripeController } from "./stripe.controller";
import StripeCreateCheckoutSessionUseCase from "./use-cases/stripe-create-checkout-session.use-case";
import StripeCreatePortalSessionUseCase from "./use-cases/stripe-create-portal-session.use-case";
import StripeWebhookChargeSucceededUseCase from "./use-cases/stripe-webhook-charge-succeeded.use-case";
import StripeWebhookInvoiceFinalizedUseCase from "./use-cases/stripe-webhook-invoice-finalized.use-case";

@Module({
	controllers: [StripeController],
	providers: [
		Database,
		{
			provide: "StripeRepositoryPort",
			inject: [Database],
			useFactory: (database: Database) => {
				return new StripeRepository(undefined, undefined, undefined, undefined, undefined, undefined, database);
			},
		},
		{
			provide: "UsersRepositoryPort",
			inject: [Database],
			useFactory: (database: Database) => {
				return new UsersRepository(undefined, database);
			},
		},
		{
			provide: "StripeCreateCheckoutSessionUseCasePort",
			inject: ["UsersRepositoryPort"],
			useFactory: (usersRepository: UsersRepositoryPort) => {
				return new StripeCreateCheckoutSessionUseCase(usersRepository);
			},
		},
		{
			provide: "StripeCreatePortalSessionUseCasePort",
			inject: ["UsersRepositoryPort"],
			useFactory: (usersRepository: UsersRepositoryPort) => {
				return new StripeCreatePortalSessionUseCase(usersRepository);
			},
		},
		{
			provide: "StripeWebhookChargeSucceededUseCasePort",
			inject: ["StripeRepositoryPort", "UsersRepositoryPort"],
			useFactory: (stripeRepository: StripeRepositoryPort, usersRepository: UsersRepositoryPort) => {
				return new StripeWebhookChargeSucceededUseCase(stripeRepository, usersRepository);
			},
		},
		{
			provide: "StripeWebhookInvoiceFinalizedUseCasePort",
			inject: ["StripeRepositoryPort", "UsersRepositoryPort"],
			useFactory: (stripeRepository: StripeRepositoryPort, usersRepository: UsersRepositoryPort) => {
				return new StripeWebhookInvoiceFinalizedUseCase(stripeRepository, usersRepository);
			},
		},
	],
})
export class StripeModule {}
