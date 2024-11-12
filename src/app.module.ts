import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { ProfileModule } from "./modules/profile/profile.module";
import { StripeModule } from "./modules/stripe/stripe.module";
import { HealthCheckModule } from "./modules/healthcheck/health-check.module";
import { ConfigModule } from "@nestjs/config";
import { ValidateHeaderAuthorizationBearerToken } from "./middlewares/validate-header-authorization-bearer-token.middleware";
import { GamesModule } from "./modules/games/games.module";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
	imports: [
		HealthCheckModule,
		AuthModule,
		ProfileModule,
		StripeModule,
		GamesModule,
		ConfigModule.forRoot({ isGlobal: true }),
		ThrottlerModule.forRoot([
			{
				ttl: 1000, // milliseconds
				limit: 1, // 1 request each ttl
			},
		]),
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(ValidateHeaderAuthorizationBearerToken)
			.forRoutes(
				{ path: "/check-user-auth-token", method: RequestMethod.POST },
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
