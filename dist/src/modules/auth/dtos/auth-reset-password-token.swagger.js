"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRegisterBodyDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
class AuthRegisterBodyDTO {
}
exports.AuthRegisterBodyDTO = AuthRegisterBodyDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "9ee056764ab4492fba9712ddbe32a127", description: "Reset password token" }),
    __metadata("design:type", String)
], AuthRegisterBodyDTO.prototype, "resetPasswordToken", void 0);
//# sourceMappingURL=auth-reset-password-token.swagger.js.map