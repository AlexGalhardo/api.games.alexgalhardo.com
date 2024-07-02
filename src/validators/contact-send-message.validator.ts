import { z } from "zod";

const ContactSendMessageValidator = z.object({
	name: z.string(),
	email: z.string().email("Invalid email format"),
	subject: z.string().max(128, "Subject can have up to 128 characters"),
	message: z.string().max(1024, "Message can have up to 1024 characters")
});

export default ContactSendMessageValidator
