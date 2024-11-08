"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeModule = void 0;
const common_1 = require("@nestjs/common");
const stripe_repository_1 = require("../../repositories/stripe.repository");
const users_repository_1 = require("../../repositories/users.repository");
const database_config_1 = require("../../config/database.config");
const stripe_controller_1 = require("./stripe.controller");
const stripe_create_checkout_session_use_case_1 = require("./use-cases/stripe-create-checkout-session.use-case");
const stripe_create_portal_session_use_case_1 = require("./use-cases/stripe-create-portal-session.use-case");
const stripe_webhook_charge_succeeded_use_case_1 = require("./use-cases/stripe-webhook-charge-succeeded.use-case");
const stripe_webhook_invoice_finalized_use_case_1 = require("./use-cases/stripe-webhook-invoice-finalized.use-case");
let StripeModule = class StripeModule {
};
exports.StripeModule = StripeModule;
exports.StripeModule = StripeModule = __decorate([
    (0, common_1.Module)({
        controllers: [stripe_controller_1.StripeController],
        providers: [
            database_config_1.Database,
            {
                provide: "StripeRepositoryPort",
                inject: [database_config_1.Database],
                useFactory: (database) => {
                    return new stripe_repository_1.default(undefined, undefined, undefined, undefined, undefined, undefined, database);
                },
            },
            {
                provide: "UsersRepositoryPort",
                inject: [database_config_1.Database],
                useFactory: (database) => {
                    return new users_repository_1.default(undefined, database);
                },
            },
            {
                provide: "StripeCreateCheckoutSessionUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new stripe_create_checkout_session_use_case_1.default(usersRepository);
                },
            },
            {
                provide: "StripeCreatePortalSessionUseCasePort",
                inject: ["UsersRepositoryPort"],
                useFactory: (usersRepository) => {
                    return new stripe_create_portal_session_use_case_1.default(usersRepository);
                },
            },
            {
                provide: "StripeWebhookChargeSucceededUseCasePort",
                inject: ["StripeRepositoryPort", "UsersRepositoryPort"],
                useFactory: (stripeRepository, usersRepository) => {
                    return new stripe_webhook_charge_succeeded_use_case_1.default(stripeRepository, usersRepository);
                },
            },
            {
                provide: "StripeWebhookInvoiceFinalizedUseCasePort",
                inject: ["StripeRepositoryPort", "UsersRepositoryPort"],
                useFactory: (stripeRepository, usersRepository) => {
                    return new stripe_webhook_invoice_finalized_use_case_1.default(stripeRepository, usersRepository);
                },
            },
        ],
    })
], StripeModule);
//# sourceMappingURL=stripe.module.js.map