import { z } from "zod";
declare const ContactSendMessageValidator: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    subject: z.ZodString;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name?: string;
    email?: string;
    message?: string;
    subject?: string;
}, {
    name?: string;
    email?: string;
    message?: string;
    subject?: string;
}>;
export default ContactSendMessageValidator;
