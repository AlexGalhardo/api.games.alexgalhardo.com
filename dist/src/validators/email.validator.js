"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
class EmailValidator {
    static validate(email) {
        const emailSchema = zod_1.z.string().email();
        try {
            return emailSchema.parse(email);
        }
        catch (e) {
            return false;
        }
    }
    static generate() {
        return `teste.${Math.random().toString().split(".")[1]}@teste.com.br`;
    }
}
exports.default = EmailValidator;
//# sourceMappingURL=email.validator.js.map