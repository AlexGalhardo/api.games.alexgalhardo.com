import { Database } from "../config/database.config";
export interface StripeRepositoryPort {
    saveChargeWebhookEventLog(event: any): void;
    saveCustomerWebhookEventLog(event: any): void;
    saveInvoiceWebhookEventLog(event: any): void;
    savePaymentWebhookEventLog(event: any): void;
    saveCheckoutSessionWebhookEventLog(event: any): void;
    saveBillingPortalSessionWebhookEventLog(event: any): void;
}
export default class StripeRepository implements StripeRepositoryPort {
    private readonly charges;
    private readonly customers;
    private readonly invoices;
    private readonly checkouts;
    private readonly billingPortals;
    private readonly payments;
    private readonly database;
    constructor(charges: any[], customers: any[], invoices: any[], checkouts: any[], billingPortals: any[], payments: any[], database: Database);
    saveChargeWebhookEventLog(event: any): Promise<void>;
    saveCustomerWebhookEventLog(event: any): Promise<void>;
    saveInvoiceWebhookEventLog(event: any): Promise<void>;
    savePaymentWebhookEventLog(event: any): Promise<void>;
    saveCheckoutSessionWebhookEventLog(event: any): Promise<void>;
    saveBillingPortalSessionWebhookEventLog(event: any): Promise<void>;
}
