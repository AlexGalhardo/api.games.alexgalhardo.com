"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./modules/auth/auth.module");
const profile_module_1 = require("./modules/profile/profile.module");
const contact_module_1 = require("./modules/contact/contact.module");
const stripe_module_1 = require("./modules/stripe/stripe.module");
const health_check_module_1 = require("./modules/healthcheck/health-check.module");
const config_1 = require("@nestjs/config");
const validate_header_authorization_bearer_token_middleware_1 = require("./middlewares/validate-header-authorization-bearer-token.middleware");
const games_module_1 = require("./modules/games/games.module");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(validate_header_authorization_bearer_token_middleware_1.ValidateHeaderAuthorizationBearerToken)
            .forRoutes({ path: "/check-user-jwt-token", method: common_1.RequestMethod.POST }, { path: "/logout", method: common_1.RequestMethod.POST }, { path: "/profile", method: common_1.RequestMethod.PUT }, { path: "/stripe/create-checkout-session", method: common_1.RequestMethod.POST }, { path: "/stripe/create-portal-session", method: common_1.RequestMethod.POST }, { path: "/games/random", method: common_1.RequestMethod.GET }, { path: "/games/id/:game_id", method: common_1.RequestMethod.GET }, { path: "/games/title/:game_title", method: common_1.RequestMethod.GET });
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            health_check_module_1.HealthCheckModule,
            auth_module_1.AuthModule,
            profile_module_1.ProfileModule,
            contact_module_1.ContactModule,
            stripe_module_1.StripeModule,
            games_module_1.GamesModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 1000,
                    limit: 1,
                },
            ]),
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map