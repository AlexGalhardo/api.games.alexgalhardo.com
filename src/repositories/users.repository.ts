import * as fs from "fs";
import * as usersDatabase from "./jsons/users.json";
import { ErrorsMessages } from "../utils/errors-messages.util";
import DateTime from "../utils/date-time.util";
import { Bcrypt } from "../utils/bcrypt.util";
import { Injectable } from "@nestjs/common";
import { Database } from "../config/database.config";
import { SubscriptionName } from "../modules/auth/use-cases/auth-register.use-case";
import { ProfileUpdateBodyDTO } from "src/modules/profile/dtos/profile-update.swagger";

export interface User {
	id: string;
	name: string;
	email: string;
	phone_number: string | null;
	password: string;
	jwt_token: string;
	api_key: string | null;
	api_requests_today: number;
	date_last_api_request: null | string;
	reset_password_token: string | null;
	reset_password_token_expires_at: string | null;
	stripe: {
		customer_id: string | null;
		subscription: {
			active: boolean;
			name: string | null;
			starts_at: string | null;
			ends_at: string | null;
			charge_id: string | null;
			receipt_url: string | null;
			hosted_invoice_url: string | null;
		};
		updated_at: Date | null;
	};
	created_at: string | Date;
	updated_at: string | Date | null;
	deleted_at?: string | Date | null;
}

export interface UserUpdated {
	name: string;
	email?: string;
	phone_number: string;
}

export interface UserResponse {
	user: User;
	index: number;
}

export interface StripeSubscriptionInfo {
	apiToken?: string | null;
	customerId: string | null;
	paid?: boolean | null;
	chargeId?: string | null;
	invoiceId?: string | null;
	amount?: number | null;
	receiptUrl?: string | null;
	hostedInvoiceUrl?: string | null;
	startAt?: string | null;
	endsAt?: string | null;
	createdAt: string | null;
	createdAtBrazil: string | null;
}

export interface IncrementAPIRequestResponse {
	success: boolean;
	found_api_key: boolean;
	api_requests_today: number;
}

export interface UsersRepositoryPort {
	save(user?: any, index?: number): Promise<void>;
	transformToUserResponse(user): UserResponse;
	transformToUser(user): User;
	findByEmail(email: string): Promise<UserResponse>;
	findById(userId: string): Promise<UserResponse>;
	findByResetPasswordToken(resetPasswordToken: string): Promise<UserResponse>;
	create(user: User): Promise<void>;
	update(userId: string, profileUpdatePayload: ProfileUpdateBodyDTO): Promise<UserUpdated>;
	deleteByEmail(email: string): Promise<void>;
	logout(userId: string): Promise<void>;
	saveResetPasswordToken(userId: string, resetPasswordToken: string): Promise<void>;
	resetPassword(userId: string, newPassword: string): Promise<void>;
	findResetPasswordToken(resetPasswordToken: string): Promise<boolean>;
	updateStripeSubscriptionInfo(user: User, stripeSubscriptionInfo: StripeSubscriptionInfo): Promise<User>;
	phoneAlreadyRegistred(userId: string, phoneNumber: string): Promise<boolean>;
	incrementAPIRequest(apiKey: string): Promise<IncrementAPIRequestResponse>;
}

@Injectable()
export default class UsersRepository implements UsersRepositoryPort {
	constructor(
		private users: User[] = usersDatabase,
		private readonly database: Database,
	) {}

	public async save(user?: User, index?: number): Promise<void> {
		if (process.env.USE_JSON_DATABASE === "true") {
			try {
				if (user && index) {
					this.users.splice(index, 1, user);
				}

				fs.writeFileSync("./src/repositories/jsons/users.json", JSON.stringify(this.users, null, 4), "utf-8");
				this.users = JSON.parse(fs.readFileSync("./src/repositories/jsons/users.json", "utf-8"));
			} catch (error: any) {
				throw new Error(error);
			}
		} else {
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

	public transformToUserResponse(user): UserResponse {
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

	public transformToUser(user): User {
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

	public async findByEmail(email: string): Promise<UserResponse> {
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
		} catch (error: any) {
			throw new Error(error);
		}
	}

	public async findById(userId: string): Promise<UserResponse> {
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
		} catch (error: any) {
			throw new Error(error);
		}
	}

	public async findByResetPasswordToken(resetPasswordToken: string): Promise<UserResponse> {
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

		if (user) return this.transformToUserResponse(user);

		throw new Error(ErrorsMessages.USER_NOT_FOUND);
	}

	public async create(user: User): Promise<void> {
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

	public async update(userId: string, profileUpdatePayload: ProfileUpdateBodyDTO): Promise<UserUpdated> {
		if (process.env.USE_JSON_DATABASE === "true") {
			for (let i = 0; i < this.users.length; i++) {
				if (this.users[i].id === userId) {
					this.users[i].name = profileUpdatePayload.name ?? this.users[i].name;

					this.users[i].phone_number = profileUpdatePayload.phone_number ?? this.users[i].phone_number;

					if (profileUpdatePayload.newPassword)
						this.users[i].password = await Bcrypt.hash(profileUpdatePayload.newPassword);

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
					? await Bcrypt.hash(profileUpdatePayload.newPassword)
					: undefined,
			},
		});

		return {
			name: userUpdated.name,
			email: userUpdated.email,
			phone_number: userUpdated.phone_number,
		};
	}

	public async deleteByEmail(email: string): Promise<void> {
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

	public async logout(userId: string): Promise<void> {
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

	public async phoneAlreadyRegistred(userId: string, phoneNumber: string): Promise<boolean> {
		if (process.env.USE_JSON_DATABASE === "true") {
			return this.users.some((user) => {
				if (user.id !== userId && user.phone_number === phoneNumber) return true;
			});
		}

		const user = await this.database.users.findFirst({
			where: {
				phone_number: phoneNumber,
			},
		});

		if (user) {
			if (user.id !== userId) return true;
		}
		return false;
	}

	public async saveResetPasswordToken(userId: string, resetPasswordToken: string): Promise<void> {
		if (process.env.USE_JSON_DATABASE === "true") {
			for (let i = 0; i < this.users.length; i++) {
				if (this.users[i].id === userId) {
					this.users[i].reset_password_token = resetPasswordToken;
					this.users[i].reset_password_token_expires_at = String(
						new Date(new Date().getTime() + 60 * 60 * 1000),
					);
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

	public async resetPassword(userId: string, newPassword: string): Promise<void> {
		if (process.env.USE_JSON_DATABASE === "true") {
			for (let i = 0; i < this.users.length; i++) {
				if (this.users[i].id === userId) {
					if (!DateTime.isExpired(new Date(this.users[i].reset_password_token_expires_at))) {
						this.users[i].password = newPassword;
						this.users[i].reset_password_token = null;
						this.users[i].reset_password_token_expires_at = null;
						this.save();
						break;
					} else {
						throw new Error(ErrorsMessages.RESET_PASSWORD_TOKEN_EXPIRED);
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
			if (!DateTime.isExpired(new Date(user.reset_password_token_expires_at))) {
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
			} else {
				throw new Error(ErrorsMessages.RESET_PASSWORD_TOKEN_EXPIRED);
			}
		}
	}

	public async findResetPasswordToken(resetPasswordToken: string): Promise<boolean> {
		if (process.env.USE_JSON_DATABASE === "true") {
			return this.users.some((user) => {
				if (
					user.reset_password_token === resetPasswordToken &&
					!DateTime.isExpired(new Date(user.reset_password_token_expires_at))
				) {
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
			if (!DateTime.isExpired(new Date(user.reset_password_token_expires_at))) return true;
		}
		return false;
	}

	public async updateStripeSubscriptionInfo(
		user: User,
		stripeSubscriptionInfo: StripeSubscriptionInfo,
	): Promise<User> {
		let subscriptionName = "NOOB";

		if (stripeSubscriptionInfo.amount) subscriptionName = stripeSubscriptionInfo.amount === 499 ? "PRO" : "CASUAL";

		if (process.env.USE_JSON_DATABASE === "true") {
			for (let i = 0; i < this.users.length; i++) {
				if (this.users[i].id === user.id) {
					this.users[i].api_key = stripeSubscriptionInfo.apiToken ?? this.users[i].api_key;
					this.users[i].stripe.customer_id =
						stripeSubscriptionInfo.customerId ?? this.users[i].stripe.customer_id;
					this.users[i].stripe.subscription.active =
						stripeSubscriptionInfo.paid ?? this.users[i].stripe.subscription.active;
					this.users[i].stripe.subscription.charge_id =
						stripeSubscriptionInfo.chargeId ?? this.users[i].stripe.subscription.charge_id;
					this.users[i].stripe.subscription.name = subscriptionName;

					this.users[i].stripe.subscription.receipt_url =
						stripeSubscriptionInfo.receiptUrl ?? this.users[i].stripe.subscription.receipt_url;
					this.users[i].stripe.subscription.hosted_invoice_url =
						stripeSubscriptionInfo.hostedInvoiceUrl ?? this.users[i].stripe.subscription.hosted_invoice_url;
					this.users[i].stripe.subscription.starts_at =
						stripeSubscriptionInfo.startAt ?? this.users[i].stripe.subscription.starts_at;
					this.users[i].stripe.subscription.ends_at =
						stripeSubscriptionInfo.endsAt ?? this.users[i].stripe.subscription.ends_at;
					this.users[i].stripe.updated_at = new Date();

					this.save();

					return this.users[i];
				}
			}

			throw new Error(ErrorsMessages.USER_NOT_FOUND);
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

	public async verifyIfSubscriptionIsActiveAndNotExpired(user: User): Promise<void> {
		if (user.stripe.subscription.active === true && user.stripe.subscription.ends_at !== null) {
			const endsAtDate = new Date(
				user.stripe.subscription.ends_at.replace(
					/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
					"$3-$2-$1T$4:$5:$6",
				),
			);

			if (endsAtDate <= new Date()) {
				if (process.env.USE_JSON_DATABASE === "true") {
					for (let i = 0; i < this.users.length; i++) {
						if (this.users[i].id === user.id) {
							this.users[i].stripe.subscription.active = false;
							this.users[i].stripe.subscription.charge_id = null;
							this.users[i].stripe.subscription.name = SubscriptionName.NOOB;
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
						stripe_subscription_name: SubscriptionName.NOOB,
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

	public async incrementAPIRequest(apiKey: string): Promise<IncrementAPIRequestResponse> {
		if (process.env.USE_JSON_DATABASE === "true") {
			const index = this.users.findIndex((user: any) => user.api_key === apiKey);

			if (index === -1) {
				return {
					success: false,
					found_api_key: false,
					api_requests_today: 0,
				};
			}

			const user = this.users[index];

			if (user.date_last_api_request && DateTime.isToday(new Date(user.date_last_api_request))) {
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
			} else {
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

		if (user.date_last_api_request && DateTime.isToday(new Date(user.date_last_api_request))) {
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
		} else {
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
}
