"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const AuthResetPasswordValidator = zod_1.z
    .object({
    newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters long"),
    confirmNewPassword: zod_1.z.string().min(6, "Confirm new password must be at least 6 characters long"),
})
    .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
});
exports.default = AuthResetPasswordValidator;
//# sourceMappingURL=auth-reset-password.validator.js.map