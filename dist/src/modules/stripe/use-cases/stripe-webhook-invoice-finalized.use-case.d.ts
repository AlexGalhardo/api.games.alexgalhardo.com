import { StripeRepositoryPort } from "src/repositories/stripe.repository";
import { UsersRepositoryPort } from "src/repositories/users.repository";
export interface StripeWebhookInvoiceFinalizedUseCasePort {
    execute(event: any): void;
}
export default class StripeWebhookInvoiceFinalizedUseCase implements StripeWebhookInvoiceFinalizedUseCasePort {
    private readonly stripeRepository;
    private readonly usersRepository;
    constructor(stripeRepository: StripeRepositoryPort, usersRepository: UsersRepositoryPort);
    execute(event: any): Promise<void>;
}
