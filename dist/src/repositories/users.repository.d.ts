import { Database } from "../config/database.config";
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
    transformToUserResponse(user: any): UserResponse;
    transformToUser(user: any): User;
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
export default class UsersRepository implements UsersRepositoryPort {
    private users;
    private readonly database;
    constructor(users: User[], database: Database);
    save(user?: User, index?: number): Promise<void>;
    transformToUserResponse(user: any): UserResponse;
    transformToUser(user: any): User;
    findByEmail(email: string): Promise<UserResponse>;
    findById(userId: string): Promise<UserResponse>;
    findByResetPasswordToken(resetPasswordToken: string): Promise<UserResponse>;
    create(user: User): Promise<void>;
    update(userId: string, profileUpdatePayload: ProfileUpdateBodyDTO): Promise<UserUpdated>;
    deleteByEmail(email: string): Promise<void>;
    logout(userId: string): Promise<void>;
    phoneAlreadyRegistred(userId: string, phoneNumber: string): Promise<boolean>;
    saveResetPasswordToken(userId: string, resetPasswordToken: string): Promise<void>;
    resetPassword(userId: string, newPassword: string): Promise<void>;
    findResetPasswordToken(resetPasswordToken: string): Promise<boolean>;
    updateStripeSubscriptionInfo(user: User, stripeSubscriptionInfo: StripeSubscriptionInfo): Promise<User>;
    verifyIfSubscriptionIsActiveAndNotExpired(user: User): Promise<void>;
    incrementAPIRequest(apiKey: string): Promise<IncrementAPIRequestResponse>;
}
