import { Response } from "express";
import { StripeRepositoryPort } from "src/repositories/stripe.repository";
import { StripeCreateCheckoutSessionDTO, StripeCreateCheckoutSessionUseCasePort } from "./use-cases/stripe-create-checkout-session.use-case";
import { StripeCreatePortalSessionUseCasePort } from "./use-cases/stripe-create-portal-session.use-case";
import { StripeWebhookChargeSucceededUseCasePort } from "./use-cases/stripe-webhook-charge-succeeded.use-case";
import { StripeWebhookInvoiceFinalizedUseCasePort } from "./use-cases/stripe-webhook-invoice-finalized.use-case";
interface StripeUseCaseResponse {
    success: boolean;
    redirect?: string;
    message?: string;
}
interface StripeWebhookEventDTO {
    id: string;
    type: string;
    event: any;
    data: any;
    created: number;
}
interface StripeCreatePortalSessionDTO {
    session_id: string;
}
interface StripeControllerPort {
    createCheckoutSession(stripeCreateCheckoutSessionDTO: StripeCreateCheckoutSessionDTO, response: Response): Promise<Response<StripeUseCaseResponse>>;
    createPortalSession(stripeCreatePortalSessionDTO: StripeCreatePortalSessionDTO, response: Response): Promise<Response<StripeUseCaseResponse>>;
    webhook(event: StripeWebhookEventDTO, response: Response): Promise<Response<{
        received: boolean;
    }>>;
}
export declare class StripeController implements StripeControllerPort {
    private readonly stripeRepository;
    private readonly stripeCreateCheckoutSessionUseCase;
    private readonly stripeCreatePortalSessionUseCase;
    private readonly stripeWebhookChargeSucceededUseCase;
    private readonly stripeWebhookInvoiceFinalizedUseCase;
    constructor(stripeRepository: StripeRepositoryPort, stripeCreateCheckoutSessionUseCase: StripeCreateCheckoutSessionUseCasePort, stripeCreatePortalSessionUseCase: StripeCreatePortalSessionUseCasePort, stripeWebhookChargeSucceededUseCase: StripeWebhookChargeSucceededUseCasePort, stripeWebhookInvoiceFinalizedUseCase: StripeWebhookInvoiceFinalizedUseCasePort);
    createCheckoutSession(stripeCreateCheckoutSessionDTO: StripeCreateCheckoutSessionDTO, response: Response): Promise<Response<StripeUseCaseResponse>>;
    createPortalSession(stripeCreatePortalSessionDTO: StripeCreatePortalSessionDTO, response: Response): Promise<Response<StripeUseCaseResponse>>;
    webhook(event: StripeWebhookEventDTO, response: Response): Promise<Response<{
        received: boolean;
    }>>;
}
export {};
