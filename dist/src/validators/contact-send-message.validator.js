"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ContactSendMessageValidator = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name cannot be empty"),
    email: zod_1.z.string().email("Invalid email format"),
    subject: zod_1.z.string().max(128, "Subject can have up to 128 characters").min(1, "Subject cannot be empty"),
    message: zod_1.z.string().max(1024, "Message can have up to 1024 characters").min(1, "Message cannot be empty"),
});
exports.default = ContactSendMessageValidator;
//# sourceMappingURL=contact-send-message.validator.js.map