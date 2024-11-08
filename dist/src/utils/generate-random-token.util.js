"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GenerateRandomToken;
const crypto = require("crypto");
function GenerateRandomToken(tokenLength = 48) {
    return crypto
        .randomBytes(Math.ceil(tokenLength / 2))
        .toString("hex")
        .slice(0, tokenLength);
}
//# sourceMappingURL=generate-random-token.util.js.map