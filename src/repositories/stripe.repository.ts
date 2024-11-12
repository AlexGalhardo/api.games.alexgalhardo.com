import { Database } from "../config/database.config";
import { Injectable } from "@nestjs/common";

export interface StripeRepositoryPort {
	saveChargeWebhookEventLog(event: any): void;
	saveCustomerWebhookEventLog(event: any): void;
	saveInvoiceWebhookEventLog(event: any): void;
	savePaymentWebhookEventLog(event: any): void;
	saveCheckoutSessionWebhookEventLog(event: any): void;
	saveBillingPortalSessionWebhookEventLog(event: any): void;
}

@Injectable()
export default class StripeRepository implements StripeRepositoryPort {
	constructor(private readonly database: Database) {}

	public async saveChargeWebhookEventLog(event: any) {
		try {
			await this.database.stripeWebhookChargesLogs.create({
				data: {
					event_log: JSON.stringify(event),
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async saveCustomerWebhookEventLog(event: any) {
		try {
			await this.database.stripeWebhookCustomersLogs.create({
				data: {
					event_log: JSON.stringify(event),
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async saveInvoiceWebhookEventLog(event: any) {
		try {
			await this.database.stripeWebhookInvoicesLogs.create({
				data: {
					event_log: JSON.stringify(event),
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async savePaymentWebhookEventLog(event: any) {
		try {
			await this.database.stripeWebhookPaymentsLogs.create({
				data: {
					event_log: JSON.stringify(event),
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async saveCheckoutSessionWebhookEventLog(event: any) {
		try {
			await this.database.stripeWebhookCheckoutsLogs.create({
				data: {
					event_log: JSON.stringify(event),
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async saveBillingPortalSessionWebhookEventLog(event: any) {
		try {
			await this.database.stripeWebhookBillingPortalLogs.create({
				data: {
					event_log: JSON.stringify(event),
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}
}
