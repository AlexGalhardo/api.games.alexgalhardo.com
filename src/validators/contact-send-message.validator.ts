import { z } from "zod";

export const ContactSendMessageValidator = z.object({
	name: z.string().min(1, "Name cannot be empty"),
	email: z.string().email("Invalid email format"),
	subject: z.string().max(128, "Subject can have up to 128 characters").min(1, "Subject cannot be empty"),
	message: z.string().max(1024, "Message can have up to 1024 characters").min(1, "Message cannot be empty"),
});
