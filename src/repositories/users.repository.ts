import DateTime from "../utils/date-time.util";
import { Bcrypt } from "../utils/bcrypt.util";
import { Injectable } from "@nestjs/common";
import { Database } from "../config/database.config";
import { SubscriptionName } from "../modules/auth/use-cases/auth-signup.use-case";
import { ProfileUpdateDTO } from "src/modules/profile/dtos/profile-update.dto";
import { User } from "@prisma/client";

export interface IncrementAPIRequestResponse {
	success: boolean;
	found_api_key: boolean;
	api_requests_today: number;
}

export interface UsersRepositoryPort {
	findByEmail(email: string): Promise<User>;
	findById(userId: string): Promise<User>;
	findByResetPasswordToken(resetPasswordToken: string): Promise<User>;
	create(user: any): Promise<User>;
	update(userId: string, profileUpdatePayload: ProfileUpdateDTO): Promise<User>;
	updateAuthToken(userId: string, authToken: string): Promise<User>;
	deleteByEmail(email: string): Promise<void>;
	logout(userId: string): Promise<void>;
	saveResetPasswordToken(userId: string, resetPasswordToken: string): Promise<void>;
	resetPassword(userId: string, newPassword: string): Promise<void>;
	findResetPasswordToken(resetPasswordToken: string): Promise<boolean>;
	updateStripeSubscriptionInfo(user: User, stripeSubscriptionInfo: any): Promise<User>;
	phoneAlreadyRegistred(userId: string, phoneNumber: string): Promise<boolean>;
	incrementAPIRequest(apiKey: string): Promise<IncrementAPIRequestResponse>;
}

@Injectable()
export default class UsersRepository implements UsersRepositoryPort {
	constructor(private readonly database: Database) {}

	public async findByEmail(email: string): Promise<User> {
		try {
			return await this.database.user.findUnique({
				where: {
					email,
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async findById(userId: string): Promise<User> {
		try {
			return await this.database.user.findUnique({
				where: {
					id: userId,
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async findByResetPasswordToken(resetPasswordToken: string): Promise<User> {
		try {
			return await this.database.user.findFirst({
				where: {
					reset_password_token: resetPasswordToken,
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async create(user: any): Promise<User> {
		try {
			return await this.database.user.create({
				data: {
					id: user.id,
					name: user.name,
					email: user.email,
					phone_number: user.phone_number,
					password: user.password,
					auth_token: user.auth_token,
					api_key: user.api_key,
					reset_password_token: user.reset_password_token,
					reset_password_token_expires_at: user.reset_password_token_expires_at,
					stripe_customer_id: user.stripe_customer_id,
					stripe_subscription_active: user.stripe_subscription_active,
					stripe_subscription_name: user.stripe_subscription_name,
					stripe_subscription_starts_at: user.stripe_subscription_starts_at,
					stripe_subscription_ends_at: user.stripe_subscription_ends_at,
					stripe_subscription_charge_id: user.stripe_subscription_charge_id,
					stripe_subscription_receipt_url: user.stripe_subscription_receipt_url,
					stripe_subscription_hosted_invoice_url: user.stripe_subscription_hosted_invoice_url,
					stripe_updated_at: user.stripe_updated_at,
					created_at: user.created_at,
					updated_at: user.updated_at,
					deleted_at: null,
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async update(userId: string, profileUpdatePayload: ProfileUpdateDTO): Promise<User> {
		try {
			return await this.database.user.update({
				where: {
					id: userId,
				},
				data: {
					name: profileUpdatePayload.name ? profileUpdatePayload.name : undefined,
					phone_number: profileUpdatePayload.phone_number ? profileUpdatePayload.phone_number : undefined,
					password: profileUpdatePayload.new_password
						? await Bcrypt.hash(profileUpdatePayload.new_password)
						: undefined,
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async updateAuthToken(userId: string, authToken: string): Promise<User> {
		try {
			return await this.database.user.update({
				where: {
					id: userId,
				},
				data: {
					auth_token: authToken,
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async deleteByEmail(email: string): Promise<void> {
		try {
			await this.database.user.delete({
				where: {
					email,
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async logout(userId: string): Promise<void> {
		try {
			await this.database.user.update({
				where: {
					id: userId,
				},
				data: {
					auth_token: null,
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async phoneAlreadyRegistred(userId: string, phoneNumber: string): Promise<boolean> {
		try {
			const user = await this.database.user.findFirst({
				where: {
					phone_number: phoneNumber,
				},
			});

			if (user) {
				if (user.id !== userId) return true;
			}
			return false;
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async saveResetPasswordToken(userId: string, resetPasswordToken: string): Promise<void> {
		try {
			await this.database.user.update({
				where: {
					id: userId,
				},
				data: {
					reset_password_token: resetPasswordToken,
					reset_password_token_expires_at: String(new Date(new Date().getTime() + 60 * 60 * 1000)),
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async resetPassword(userId: string, newPassword: string): Promise<void> {
		try {
			const user = await this.database.user.findUnique({
				where: {
					id: userId,
				},
			});

			if (user) {
				if (!DateTime.isExpired(new Date(user.reset_password_token_expires_at))) {
					await this.database.user.update({
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
					throw new Error("Reset password token expired");
				}
			}
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async findResetPasswordToken(resetPasswordToken: string): Promise<boolean> {
		try {
			const user = await this.database.user.findFirst({
				where: {
					reset_password_token: resetPasswordToken,
				},
			});

			if (user) {
				if (!DateTime.isExpired(new Date(user.reset_password_token_expires_at))) return true;
			}
			return false;
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async updateStripeSubscriptionInfo(user: User, stripeSubscriptionInfo: any): Promise<User> {
		try {
			let subscriptionName = "NOOB";

			if (stripeSubscriptionInfo.amount)
				subscriptionName = stripeSubscriptionInfo.amount === 499 ? "PRO" : "CASUAL";

			return await this.database.user.update({
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
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async verifyIfSubscriptionIsActiveAndNotExpired(user: any): Promise<void> {
		try {
			if (user.stripe_subscription_active === true && user.stripe_subscription_ends_at !== null) {
				const endsAtDate = new Date(
					user.stripe_subscription_ends_at.replace(
						/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
						"$3-$2-$1T$4:$5:$6",
					),
				);

				if (endsAtDate <= new Date()) {
					await this.database.user.update({
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
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async incrementAPIRequest(apiKey: string): Promise<IncrementAPIRequestResponse> {
		try {
			const user = await this.database.user.findUnique({
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
				await this.database.user.update({
					where: {
						api_key: apiKey,
					},
					data: { api_requests_today: 0, date_last_api_request: new Date().toISOString() },
				});
			}

			await this.database.user.update({
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
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}
}
