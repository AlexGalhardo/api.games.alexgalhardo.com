import * as fs from "fs";
import * as StripeCharges from "./jsons/stripe/charges.json"
import * as StripeCustomers from "./jsons/stripe/customers.json"
import * as StripeInvoices from "./jsons/stripe/invoices.json"
import * as StripeCheckouts from "./jsons/stripe/checkouts.json"
import * as StripeBillingPortals from "./jsons/stripe/billing-portals.json"
import * as StripePayments from "./jsons/stripe/payments.json"
import { Database } from "../config/database.config.js";
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
	constructor(
		private charges = StripeCharges,
		private customers = StripeCustomers,
		private invoices = StripeInvoices,
		private checkouts = StripeCheckouts,
		private billingPortals = StripeBillingPortals,
		private payments = StripePayments,
		private readonly database: Database,
	) { }

	public async saveChargeWebhookEventLog(event: any) {
		if (process.env.USE_JSON_DATABASE === "true") {
			try {
				this.charges.push(event);
				fs.writeFileSync(
					"./../repositories/Jsons/stripe/charges.json",
					JSON.stringify(this.charges, null, 4),
					"utf-8",
				);
			} catch (error: any) {
				throw new Error(error);
			}
		}

		try {
			await this.database.stripeWebhookChargesLogs.create({
				data: {
					event_log: JSON.stringify(event),
				},
			});
		} catch (error: any) {
			throw new Error(error);
		}
	}

	public async saveCustomerWebhookEventLog(event: any) {
		if (process.env.USE_JSON_DATABASE === "true") {
			try {
				this.customers.push(event);
				fs.writeFileSync(
					"./../repositories/Jsons/stripe/customers.json",
					JSON.stringify(this.customers, null, 4),
					"utf-8",
				);
			} catch (error: any) {
				throw new Error(error);
			}
		}

		try {
			await this.database.stripeWebhookCustomersLogs.create({
				data: {
					event_log: JSON.stringify(event),
				},
			});
		} catch (error: any) {
			throw new Error(error);
		}
	}

	public async saveInvoiceWebhookEventLog(event: any) {
		if (process.env.USE_JSON_DATABASE === "true") {
			try {
				this.invoices.push(event);
				fs.writeFileSync(
					"./../repositories/Jsons/stripe/invoices.json",
					JSON.stringify(this.invoices, null, 4),
					"utf-8",
				);
			} catch (error: any) {
				throw new Error(error);
			}
		}

		try {
			await this.database.stripeWebhookInvoicesLogs.create({
				data: {
					event_log: JSON.stringify(event),
				},
			});
		} catch (error: any) {
			throw new Error(error);
		}
	}

	public async savePaymentWebhookEventLog(event: any) {
		if (process.env.USE_JSON_DATABASE === "true") {
			try {
				this.payments.push(event);
				fs.writeFileSync(
					"./../repositories/Jsons/stripe/payments.json",
					JSON.stringify(this.payments, null, 4),
					"utf-8",
				);
			} catch (error: any) {
				throw new Error(error);
			}
		}

		try {
			await this.database.stripeWebhookPaymentsLogs.create({
				data: {
					event_log: JSON.stringify(event),
				},
			});
		} catch (error: any) {
			throw new Error(error);
		}
	}

	public async saveCheckoutSessionWebhookEventLog(event: any) {
		if (process.env.USE_JSON_DATABASE === "true") {
			try {
				this.checkouts.push(event);
				fs.writeFileSync(
					"./../repositories/Jsons/stripe/checkouts.json",
					JSON.stringify(this.checkouts, null, 4),
					"utf-8",
				);
			} catch (error: any) {
				throw new Error(error);
			}
		}

		try {
			await this.database.stripeWebhookCheckoutsLogs.create({
				data: {
					event_log: JSON.stringify(event),
				},
			});
		} catch (error: any) {
			throw new Error(error);
		}
	}

	public async saveBillingPortalSessionWebhookEventLog(event: any) {
		if (process.env.USE_JSON_DATABASE === "true") {
			try {
				this.billingPortals.push(event);
				fs.writeFileSync(
					"./../repositories/Jsons/stripe/billingPortals.json",
					JSON.stringify(this.billingPortals, null, 4),
					"utf-8",
				);
			} catch (error: any) {
				throw new Error(error);
			}
		}

		try {
			await this.database.stripeWebhookBillingPortalLogs.create({
				data: {
					event_log: JSON.stringify(event),
				},
			});
		} catch (error: any) {
			throw new Error(error);
		}
	}
}
