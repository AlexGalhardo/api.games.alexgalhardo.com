"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateHeaderAuthorizationBearerToken = void 0;
const common_1 = require("@nestjs/common");
const errors_messages_util_1 = require("../utils/errors-messages.util");
let ValidateHeaderAuthorizationBearerToken = class ValidateHeaderAuthorizationBearerToken {
    use(request, response, next) {
        var _a;
        if (!((_a = request.headers) === null || _a === void 0 ? void 0 : _a.authorization) ||
            !request.headers.authorization.startsWith("Bearer") ||
            !request.headers.authorization.split(" ")[1]) {
            return response
                .status(common_1.HttpStatus.BAD_REQUEST)
                .json({ success: false, error: errors_messages_util_1.ErrorsMessages.MISSING_HEADER_AUTHORIZATION_BEARER_TOKEN });
        }
        const token = request.headers.authorization.split(" ")[1];
        response.locals.token = token;
        next();
    }
};
exports.ValidateHeaderAuthorizationBearerToken = ValidateHeaderAuthorizationBearerToken;
exports.ValidateHeaderAuthorizationBearerToken = ValidateHeaderAuthorizationBearerToken = __decorate([
    (0, common_1.Injectable)()
], ValidateHeaderAuthorizationBearerToken);
//# sourceMappingURL=validate-header-authorization-bearer-token.middleware.js.map