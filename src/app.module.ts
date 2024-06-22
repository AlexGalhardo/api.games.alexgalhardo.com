import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthModule } from "./modules/auth.module.js";
import { ProfileModule } from "./modules/profile.module.js";
import { ContactModule } from "./modules/contact.module.js";
import { StripeModule } from "./modules/stripe.module.js";
import { HealthCheckModule } from "./modules/health-check.module.js";
import { ConfigModule } from "@nestjs/config";
import { ValidateToken } from "./middlewares/validate-token.middleware.js";
import { GamesModule } from "./modules/games.module.js";

@Module({
    imports: [
        HealthCheckModule,
        AuthModule,
        ProfileModule,
        ContactModule,
        StripeModule,
        GamesModule,
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ValidateToken)
            .forRoutes(
                { path: "/check-user-jwt-token", method: RequestMethod.POST },
                { path: "/logout", method: RequestMethod.POST },
                { path: "/profile", method: RequestMethod.PUT },
                { path: "/stripe/create-checkout-session", method: RequestMethod.POST },
                { path: "/stripe/create-portal-session", method: RequestMethod.POST },
                { path: "/games/random", method: RequestMethod.GET },
                { path: "/games/id/:game_id", method: RequestMethod.GET },
                { path: "/games/title/:game_title", method: RequestMethod.GET },
            );
    }
}
