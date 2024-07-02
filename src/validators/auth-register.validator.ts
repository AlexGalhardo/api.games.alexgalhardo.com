import { z } from "zod";

const BRAZIL_VALID_PHONE_DDD = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48,
    49, 51, 53, 54, 55, 61, 62, 64, 63, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89,
    91, 92, 93, 94, 95, 96, 97, 98, 99,
];

const isValidTelegramNumber = (phone: string) => {
    phone = phone.replace(/\D/g, "");

    if (phone.length !== 13) return false;
    if (parseInt(phone.substring(4, 5)) !== 9) return false;
    if (new Set(phone).size === 1) return false;
    if (BRAZIL_VALID_PHONE_DDD.indexOf(parseInt(phone.substring(2, 4))) === -1) return false;

    return true;
};

const AuthRegisterValidator = z.object({
    username: z.string().min(4, "Username must have at least 4 characters"),
    email: z.string().email("Invalid email format"),
    telegramNumber: z.string().refine(isValidTelegramNumber, "Invalid telegram number"),
    password: z
        .string()
        .min(8, "password must be at least 8 characters long")
        .refine((val) => /[A-Z]/.test(val), "password must contain at least one uppercase letter")
        .refine((val) => /[a-z]/.test(val), "password must contain at least one lowercase letter")
        .refine((val) => /[0-9]/.test(val), "password must contain at least one number")
        .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), "password must contain at least one special character"),
});

export default AuthRegisterValidator;
