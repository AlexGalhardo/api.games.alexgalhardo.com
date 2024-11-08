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
const usersDatabase = require("./jsons/users.json");
const errors_messages_util_1 = require("../utils/errors-messages.util");
const date_time_util_1 = require("../utils/date-time.util");
const bcrypt_util_1 = require("../utils/bcrypt.util");
const common_1 = require("@nestjs/common");
const database_config_1 = require("../config/database.config");
const auth_register_use_case_1 = require("../modules/auth/use-cases/auth-register.use-case");
let UsersRepository = class UsersRepository {
    constructor(users = usersDatabase, database) {
        this.users = users;
        this.database = database;
    }
    async save(user, index) {
        if (process.env.USE_JSON_DATABASE === "true") {
            try {
                if (user && index) {
                    this.users.splice(index, 1, user);
                }
                fs.writeFileSync("./src/repositories/jsons/users.json", JSON.stringify(this.users, null, 4), "utf-8");
                this.users = JSON.parse(fs.readFileSync("./src/repositories/jsons/users.json", "utf-8"));
            }
            catch (error) {
                throw new Error(error);
            }
        }
        else {
            await this.database.users.update({
                where: {
                    id: user.id,
                },
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone_number: user.phone_number,
                    password: user.password,
                    jwt_token: user.jwt_token,
                    api_key: user.api_key,
                    reset_password_token: user.reset_password_token,
                    reset_password_token_expires_at: user.reset_password_token_expires_at,
                    stripe_customer_id: user.stripe.customer_id,
                    stripe_subscription_active: user.stripe.subscription.active,
                    stripe_subscription_name: user.stripe.subscription.name,
                    stripe_subscription_starts_at: user.stripe.subscription.starts_at,
                    stripe_subscription_ends_at: user.stripe.subscription.ends_at,
                    stripe_subscription_charge_id: user.stripe.subscription.charge_id,
                    stripe_subscription_receipt_url: user.stripe.subscription.receipt_url,
                    stripe_subscription_hosted_invoice_url: user.stripe.subscription.hosted_invoice_url,
                    stripe_updated_at: user.stripe.updated_at,
                    created_at: user.created_at,
                    updated_at: user.updated_at,
                    deleted_at: null,
                },
            });
        }
    }
    transformToUserResponse(user) {
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                password: user.password,
                jwt_token: user.jwt_token,
                api_key: user.api_key,
                api_requests_today: user.api_requests_today,
                date_last_api_request: user.date_last_api_request,
                reset_password_token: user.reset_password_token,
                reset_password_token_expires_at: user.reset_password_token_expires_at,
                stripe: {
                    customer_id: user.stripe_customer_id,
                    subscription: {
                        active: user.stripe_subscription_active,
                        name: user.stripe_subscription_name,
                        starts_at: user.stripe_subscription_starts_at,
                        ends_at: user.stripe_subscription_ends_at,
                        charge_id: user.stripe_subscription_charge_id,
                        receipt_url: user.stripe_subscription_receipt_url,
                        hosted_invoice_url: user.stripe_subscription_hosted_invoice_url,
                    },
                    updated_at: user.stripe_updated_at,
                },
                created_at: user.created_at,
                updated_at: user.updated_at,
                deleted_at: null,
            },
            index: null,
        };
    }
    transformToUser(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            password: user.password,
            jwt_token: user.jwt_token,
            api_key: user.api_key,
            api_requests_today: user.api_requests_today,
            date_last_api_request: user.date_last_api_request,
            reset_password_token: user.reset_password_token,
            reset_password_token_expires_at: user.reset_password_token_expires_at,
            stripe: {
                customer_id: user.stripe_customer_id,
                subscription: {
                    active: user.stripe_subscription_active,
                    name: user.stripe_subscription_name,
                    starts_at: user.stripe_subscription_starts_at,
                    ends_at: user.stripe_subscription_ends_at,
                    charge_id: user.stripe_subscription_charge_id,
                    receipt_url: user.stripe_subscription_receipt_url,
                    hosted_invoice_url: user.stripe_subscription_hosted_invoice_url,
                },
                updated_at: user.stripe_updated_at,
            },
            created_at: user.created_at,
            updated_at: user.updated_at,
            deleted_at: null,
        };
    }
    async findByEmail(email) {
        try {
            if (process.env.USE_JSON_DATABASE === "true") {
                for (let i = 0; i < this.users.length; i++) {
                    if (this.users[i].email === email) {
                        return { user: this.users[i], index: i };
                    }
                }
                return null;
            }
            const user = await this.database.users.findUnique({
                where: {
                    email,
                },
            });
            if (user) {
                await this.verifyIfSubscriptionIsActiveAndNotExpired(this.transformToUser(user));
                return this.transformToUserResponse(user);
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async findById(userId) {
        try {
            if (process.env.USE_JSON_DATABASE === "true") {
                for (let i = 0; i < this.users.length; i++) {
                    if (this.users[i].id === userId) {
                        return { user: this.users[i], index: i };
                    }
                }
                return null;
            }
            const user = await this.database.users.findUnique({
                where: {
                    id: userId,
                },
            });
            if (user) {
                await this.verifyIfSubscriptionIsActiveAndNotExpired(this.transformToUser(user));
                return this.transformToUserResponse(user);
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async findByResetPasswordToken(resetPasswordToken) {
        if (process.env.USE_JSON_DATABASE === "true") {
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].reset_password_token === resetPasswordToken) {
                    return { user: this.users[i], index: i };
                }
            }
            return null;
        }
        const user = await this.database.users.findFirst({
            where: {
                reset_password_token: resetPasswordToken,
            },
        });
        if (user)
            return this.transformToUserResponse(user);
        throw new Error(errors_messages_util_1.ErrorsMessages.USER_NOT_FOUND);
    }
    async create(user) {
        if (process.env.USE_JSON_DATABASE === "true") {
            this.users.push(user);
            this.save();
            return;
        }
        await this.database.users.create({
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone_number: user.phone_number,
                password: user.password,
                jwt_token: user.jwt_token,
                api_key: user.api_key,
                reset_password_token: user.reset_password_token,
                reset_password_token_expires_at: user.reset_password_token_expires_at,
                stripe_customer_id: user.stripe.customer_id,
                stripe_subscription_active: user.stripe.subscription.active,
                stripe_subscription_name: user.stripe.subscription.name,
                stripe_subscription_starts_at: user.stripe.subscription.starts_at,
                stripe_subscription_ends_at: user.stripe.subscription.ends_at,
                stripe_subscription_charge_id: user.stripe.subscription.charge_id,
                stripe_subscription_receipt_url: user.stripe.subscription.receipt_url,
                stripe_subscription_hosted_invoice_url: user.stripe.subscription.hosted_invoice_url,
                stripe_updated_at: user.stripe.updated_at,
                created_at: user.created_at,
                updated_at: user.updated_at,
                deleted_at: null,
            },
        });
    }
    async update(userId, profileUpdatePayload) {
        var _a, _b;
        if (process.env.USE_JSON_DATABASE === "true") {
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].id === userId) {
                    this.users[i].name = (_a = profileUpdatePayload.name) !== null && _a !== void 0 ? _a : this.users[i].name;
                    this.users[i].phone_number = (_b = profileUpdatePayload.phone_number) !== null && _b !== void 0 ? _b : this.users[i].phone_number;
                    if (profileUpdatePayload.newPassword)
                        this.users[i].password = await bcrypt_util_1.Bcrypt.hash(profileUpdatePayload.newPassword);
                    this.save();
                    return {
                        name: this.users[i].name,
                        email: this.users[i].email,
                        phone_number: this.users[i].phone_number,
                    };
                }
            }
        }
        const userUpdated = await this.database.users.update({
            where: {
                id: userId,
            },
            data: {
                name: profileUpdatePayload.name ? profileUpdatePayload.name : undefined,
                phone_number: profileUpdatePayload.phone_number ? profileUpdatePayload.phone_number : undefined,
                password: profileUpdatePayload.newPassword
                    ? await bcrypt_util_1.Bcrypt.hash(profileUpdatePayload.newPassword)
                    : undefined,
            },
        });
        return {
            name: userUpdated.name,
            email: userUpdated.email,
            phone_number: userUpdated.phone_number,
        };
    }
    async deleteByEmail(email) {
        if (process.env.USE_JSON_DATABASE === "true") {
            this.users = this.users.filter((user) => user.email !== email);
            this.save();
            return;
        }
        await this.database.users.delete({
            where: {
                email,
            },
        });
    }
    async logout(userId) {
        if (process.env.USE_JSON_DATABASE === "true") {
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].id === userId) {
                    this.users[i].jwt_token = null;
                    this.save();
                    break;
                }
            }
            return;
        }
        await this.database.users.update({
            where: {
                id: userId,
            },
            data: {
                jwt_token: null,
            },
        });
    }
    async phoneAlreadyRegistred(userId, phoneNumber) {
        if (process.env.USE_JSON_DATABASE === "true") {
            return this.users.some((user) => {
                if (user.id !== userId && user.phone_number === phoneNumber)
                    return true;
            });
        }
        const user = await this.database.users.findFirst({
            where: {
                phone_number: phoneNumber,
            },
        });
        if (user) {
            if (user.id !== userId)
                return true;
        }
        return false;
    }
    async saveResetPasswordToken(userId, resetPasswordToken) {
        if (process.env.USE_JSON_DATABASE === "true") {
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].id === userId) {
                    this.users[i].reset_password_token = resetPasswordToken;
                    this.users[i].reset_password_token_expires_at = String(new Date(new Date().getTime() + 60 * 60 * 1000));
                    this.save();
                    break;
                }
            }
        }
        await this.database.users.update({
            where: {
                id: userId,
            },
            data: {
                reset_password_token: resetPasswordToken,
                reset_password_token_expires_at: String(new Date(new Date().getTime() + 60 * 60 * 1000)),
            },
        });
    }
    async resetPassword(userId, newPassword) {
        if (process.env.USE_JSON_DATABASE === "true") {
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].id === userId) {
                    if (!date_time_util_1.default.isExpired(new Date(this.users[i].reset_password_token_expires_at))) {
                        this.users[i].password = newPassword;
                        this.users[i].reset_password_token = null;
                        this.users[i].reset_password_token_expires_at = null;
                        this.save();
                        break;
                    }
                    else {
                        throw new Error(errors_messages_util_1.ErrorsMessages.RESET_PASSWORD_TOKEN_EXPIRED);
                    }
                }
            }
        }
        const user = await this.database.users.findUnique({
            where: {
                id: userId,
            },
        });
        if (user) {
            if (!date_time_util_1.default.isExpired(new Date(user.reset_password_token_expires_at))) {
                await this.database.users.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        password: newPassword,
                        reset_password_token: null,
                        reset_password_token_expires_at: null,
                    },
                });
            }
            else {
                throw new Error(errors_messages_util_1.ErrorsMessages.RESET_PASSWORD_TOKEN_EXPIRED);
            }
        }
    }
    async findResetPasswordToken(resetPasswordToken) {
        if (process.env.USE_JSON_DATABASE === "true") {
            return this.users.some((user) => {
                if (user.reset_password_token === resetPasswordToken &&
                    !date_time_util_1.default.isExpired(new Date(user.reset_password_token_expires_at))) {
                    return true;
                }
            });
        }
        const user = await this.database.users.findFirst({
            where: {
                reset_password_token: resetPasswordToken,
            },
        });
        if (user) {
            if (!date_time_util_1.default.isExpired(new Date(user.reset_password_token_expires_at)))
                return true;
        }
        return false;
    }
    async updateStripeSubscriptionInfo(user, stripeSubscriptionInfo) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        let subscriptionName = "NOOB";
        if (stripeSubscriptionInfo.amount)
            subscriptionName = stripeSubscriptionInfo.amount === 499 ? "PRO" : "CASUAL";
        if (process.env.USE_JSON_DATABASE === "true") {
            for (let i = 0; i < this.users.length; i++) {
                if (this.users[i].id === user.id) {
                    this.users[i].api_key = (_a = stripeSubscriptionInfo.apiToken) !== null && _a !== void 0 ? _a : this.users[i].api_key;
                    this.users[i].stripe.customer_id =
                        (_b = stripeSubscriptionInfo.customerId) !== null && _b !== void 0 ? _b : this.users[i].stripe.customer_id;
                    this.users[i].stripe.subscription.active =
                        (_c = stripeSubscriptionInfo.paid) !== null && _c !== void 0 ? _c : this.users[i].stripe.subscription.active;
                    this.users[i].stripe.subscription.charge_id =
                        (_d = stripeSubscriptionInfo.chargeId) !== null && _d !== void 0 ? _d : this.users[i].stripe.subscription.charge_id;
                    this.users[i].stripe.subscription.name = subscriptionName;
                    this.users[i].stripe.subscription.receipt_url =
                        (_e = stripeSubscriptionInfo.receiptUrl) !== null && _e !== void 0 ? _e : this.users[i].stripe.subscription.receipt_url;
                    this.users[i].stripe.subscription.hosted_invoice_url =
                        (_f = stripeSubscriptionInfo.hostedInvoiceUrl) !== null && _f !== void 0 ? _f : this.users[i].stripe.subscription.hosted_invoice_url;
                    this.users[i].stripe.subscription.starts_at =
                        (_g = stripeSubscriptionInfo.startAt) !== null && _g !== void 0 ? _g : this.users[i].stripe.subscription.starts_at;
                    this.users[i].stripe.subscription.ends_at =
                        (_h = stripeSubscriptionInfo.endsAt) !== null && _h !== void 0 ? _h : this.users[i].stripe.subscription.ends_at;
                    this.users[i].stripe.updated_at = new Date();
                    this.save();
                    return this.users[i];
                }
            }
            throw new Error(errors_messages_util_1.ErrorsMessages.USER_NOT_FOUND);
        }
        const userUpdated = await this.database.users.update({
            where: {
                id: user.id,
            },
            data: {
                api_key: stripeSubscriptionInfo.apiToken,
                stripe_customer_id: stripeSubscriptionInfo.customerId,
                stripe_subscription_active: stripeSubscriptionInfo.paid,
                stripe_subscription_charge_id: stripeSubscriptionInfo.chargeId,
                stripe_subscription_name: subscriptionName,
                stripe_subscription_receipt_url: stripeSubscriptionInfo.receiptUrl,
                stripe_subscription_hosted_invoice_url: stripeSubscriptionInfo.hostedInvoiceUrl,
                stripe_subscription_starts_at: stripeSubscriptionInfo.startAt,
                stripe_subscription_ends_at: stripeSubscriptionInfo.endsAt,
                stripe_updated_at: stripeSubscriptionInfo.createdAt,
            },
        });
        return this.transformToUser(userUpdated);
    }
    async verifyIfSubscriptionIsActiveAndNotExpired(user) {
        if (user.stripe.subscription.active === true && user.stripe.subscription.ends_at !== null) {
            const endsAtDate = new Date(user.stripe.subscription.ends_at.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
            if (endsAtDate <= new Date()) {
                if (process.env.USE_JSON_DATABASE === "true") {
                    for (let i = 0; i < this.users.length; i++) {
                        if (this.users[i].id === user.id) {
                            this.users[i].stripe.subscription.active = false;
                            this.users[i].stripe.subscription.charge_id = null;
                            this.users[i].stripe.subscription.name = auth_register_use_case_1.SubscriptionName.NOOB;
                            this.users[i].stripe.subscription.receipt_url = null;
                            this.users[i].stripe.subscription.hosted_invoice_url = null;
                            this.users[i].stripe.subscription.starts_at = null;
                            this.users[i].stripe.subscription.ends_at = null;
                            this.users[i].stripe.updated_at = new Date();
                            this.save();
                            return;
                        }
                    }
                }
                await this.database.users.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        stripe_subscription_active: false,
                        stripe_subscription_charge_id: null,
                        stripe_subscription_name: auth_register_use_case_1.SubscriptionName.NOOB,
                        stripe_subscription_receipt_url: null,
                        stripe_subscription_hosted_invoice_url: null,
                        stripe_subscription_starts_at: null,
                        stripe_subscription_ends_at: null,
                        stripe_updated_at: new Date(),
                    },
                });
            }
        }
    }
    async incrementAPIRequest(apiKey) {
        if (process.env.USE_JSON_DATABASE === "true") {
            const index = this.users.findIndex((user) => user.api_key === apiKey);
            if (index === -1) {
                return {
                    success: false,
                    found_api_key: false,
                    api_requests_today: 0,
                };
            }
            const user = this.users[index];
            if (user.date_last_api_request && date_time_util_1.default.isToday(new Date(user.date_last_api_request))) {
                const subscriptionTypes = ["NOOB", "CASUAL", "PRO"];
                const userSubscription = user.stripe.subscription.name;
                if (subscriptionTypes.includes(userSubscription)) {
                    const requiredRequests = Number(process.env[`${userSubscription}_API_REQUESTS_PER_DAY`]);
                    if (user.api_requests_today >= requiredRequests) {
                        return {
                            success: false,
                            found_api_key: true,
                            api_requests_today: user.api_requests_today,
                        };
                    }
                }
            }
            else {
                user.api_requests_today = 0;
                user.date_last_api_request = new Date().toISOString();
                this.users[index] = user;
                this.save();
            }
            user.api_requests_today++;
            user.date_last_api_request = new Date().toISOString();
            this.users[index] = user;
            this.save();
            return {
                success: true,
                found_api_key: true,
                api_requests_today: user.api_requests_today,
            };
        }
        const user = await this.database.users.findUnique({
            where: {
                api_key: apiKey,
            },
        });
        if (!user) {
            return {
                success: false,
                found_api_key: false,
                api_requests_today: 0,
            };
        }
        if (user.date_last_api_request && date_time_util_1.default.isToday(new Date(user.date_last_api_request))) {
            const subscriptionTypes = ["NOOB", "CASUAL", "PRO"];
            const userSubscription = user.stripe_subscription_name;
            if (subscriptionTypes.includes(userSubscription)) {
                const requiredRequests = Number(process.env[`${userSubscription}_API_REQUESTS_PER_DAY`]);
                if (user.api_requests_today >= requiredRequests) {
                    return {
                        success: false,
                        found_api_key: true,
                        api_requests_today: user.api_requests_today,
                    };
                }
            }
        }
        else {
            await this.database.users.update({
                where: {
                    api_key: apiKey,
                },
                data: { api_requests_today: 0, date_last_api_request: new Date().toISOString() },
            });
        }
        await this.database.users.update({
            where: {
                api_key: apiKey,
            },
            data: { api_requests_today: { increment: 1 }, date_last_api_request: new Date().toISOString() },
        });
        return {
            success: true,
            found_api_key: true,
            api_requests_today: user.api_requests_today + 1,
        };
    }
};
UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Array, database_config_1.Database])
], UsersRepository);
exports.default = UsersRepository;
//# sourceMappingURL=users.repository.js.map