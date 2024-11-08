"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const StripeCharges = require("./jsons/stripe/charges.json");
const StripeCustomers = require("./jsons/stripe/customers.json");
const StripeInvoices = require("./jsons/stripe/invoices.json");
const StripeCheckouts = require("./jsons/stripe/checkouts.json");
const StripeBillingPortals = require("./jsons/stripe/billing-portals.json");
const StripePayments = require("./jsons/stripe/payments.json");
const database_config_1 = require("../config/database.config");
const common_1 = require("@nestjs/common");
let StripeRepository = class StripeRepository {
    constructor(charges = StripeCharges, customers = StripeCustomers, invoices = StripeInvoices, checkouts = StripeCheckouts, billingPortals = StripeBillingPortals, payments = StripePayments, database) {
        this.charges = charges;
        this.customers = customers;
        this.invoices = invoices;
        this.checkouts = checkouts;
        this.billingPortals = billingPortals;
        this.payments = payments;
        this.database = database;
    }
    async saveChargeWebhookEventLog(event) {
        if (process.env.USE_JSON_DATABASE === "true") {
            try {
                this.charges.push(event);
                fs.writeFileSync("./../repositories/jsons/stripe/charges.json", JSON.stringify(this.charges, null, 4), "utf-8");
            }
            catch (error) {
                throw new Error(error);
            }
        }
        try {
            await this.database.stripeWebhookChargesLogs.create({
                data: {
                    event_log: JSON.stringify(event),
                },
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async saveCustomerWebhookEventLog(event) {
        if (process.env.USE_JSON_DATABASE === "true") {
            try {
                this.customers.push(event);
                fs.writeFileSync("./../repositories/jsons/stripe/customers.json", JSON.stringify(this.customers, null, 4), "utf-8");
            }
            catch (error) {
                throw new Error(error);
            }
        }
        try {
            await this.database.stripeWebhookCustomersLogs.create({
                data: {
                    event_log: JSON.stringify(event),
                },
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async saveInvoiceWebhookEventLog(event) {
        if (process.env.USE_JSON_DATABASE === "true") {
            try {
                this.invoices.push(event);
                fs.writeFileSync("./../repositories/jsons/stripe/invoices.json", JSON.stringify(this.invoices, null, 4), "utf-8");
            }
            catch (error) {
                throw new Error(error);
            }
        }
        try {
            await this.database.stripeWebhookInvoicesLogs.create({
                data: {
                    event_log: JSON.stringify(event),
                },
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async savePaymentWebhookEventLog(event) {
        if (process.env.USE_JSON_DATABASE === "true") {
            try {
                this.payments.push(event);
                fs.writeFileSync("./../repositories/jsons/stripe/payments.json", JSON.stringify(this.payments, null, 4), "utf-8");
            }
            catch (error) {
                throw new Error(error);
            }
        }
        try {
            await this.database.stripeWebhookPaymentsLogs.create({
                data: {
                    event_log: JSON.stringify(event),
                },
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async saveCheckoutSessionWebhookEventLog(event) {
        if (process.env.USE_JSON_DATABASE === "true") {
            try {
                this.checkouts.push(event);
                fs.writeFileSync("./../repositories/jsons/stripe/checkouts.json", JSON.stringify(this.checkouts, null, 4), "utf-8");
            }
            catch (error) {
                throw new Error(error);
            }
        }
        try {
            await this.database.stripeWebhookCheckoutsLogs.create({
                data: {
                    event_log: JSON.stringify(event),
                },
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async saveBillingPortalSessionWebhookEventLog(event) {
        if (process.env.USE_JSON_DATABASE === "true") {
            try {
                this.billingPortals.push(event);
                fs.writeFileSync("./../repositories/jsons/stripe/billingPortals.json", JSON.stringify(this.billingPortals, null, 4), "utf-8");
            }
            catch (error) {
                throw new Error(error);
            }
        }
        try {
            await this.database.stripeWebhookBillingPortalLogs.create({
                data: {
                    event_log: JSON.stringify(event),
                },
            });
        }
        catch (error) {
            throw new Error(error);
        }
    }
};
StripeRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, database_config_1.Database])
], StripeRepository);
exports.default = StripeRepository;
//# sourceMappingURL=stripe.repository.js.map