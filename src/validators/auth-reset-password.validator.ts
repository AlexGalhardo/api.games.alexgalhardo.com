import { z } from "zod";

const AuthResetPasswordValidator = z.object({
	newPassword: z.string().min(6, "New password must be at least 6 characters long"),
	confirmNewPassword: z.string().min(6, "Confirm new password must be at least 6 characters long")
}).refine(data => data.newPassword === data.confirmNewPassword, {
	message: "Passwords do not match",
	path: ["confirmNewPassword"]
});

export default AuthResetPasswordValidator;
