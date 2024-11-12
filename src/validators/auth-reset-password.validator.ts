import { z } from "zod";

export const AuthResetPasswordValidator = z
	.object({
		new_password: z.string().min(6, "New password must be at least 6 characters long"),
		confirm_new_password: z.string().min(6, "Confirm new password must be at least 6 characters long"),
	})
	.refine((data) => data.new_password === data.confirm_new_password, {
		message: "Passwords do not match",
		path: ["confirmNewPassword"],
	});
