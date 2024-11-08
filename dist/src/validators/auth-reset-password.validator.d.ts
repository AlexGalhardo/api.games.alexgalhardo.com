import { z } from "zod";
declare const AuthResetPasswordValidator: z.ZodEffects<z.ZodObject<{
    newPassword: z.ZodString;
    confirmNewPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    newPassword?: string;
    confirmNewPassword?: string;
}, {
    newPassword?: string;
    confirmNewPassword?: string;
}>, {
    newPassword?: string;
    confirmNewPassword?: string;
}, {
    newPassword?: string;
    confirmNewPassword?: string;
}>;
export default AuthResetPasswordValidator;
