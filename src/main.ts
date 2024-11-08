import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
// import errsole from "errsole";
// import ErrsolePostgres from "errsole-postgres";
// import { NextFunction } from "express";
// import * as bodyParser from "body-parser";
import verifyEnvs from "./utils/verify-envs.util";
import { apiReference } from "@scalar/nestjs-api-reference";

verifyEnvs();

// if (process.env.ENABLE_ERRSOLE === "true") {
// 	errsole.initialize({
// 		storage: new ErrsolePostgres({
// 			host: process.env.DATABASE_HOST,
// 			user: process.env.DATABASE_USERNAME,
// 			password: process.env.DATABASE_PASSWORD,
// 			database: process.env.DATABASE_NAME,
// 		}),
// 	});
// }

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// if (process.env.ENABLE_ERRSOLE === "true") {
	// 	app.use(bodyParser.json());

	// 	app.use("/errsole", (req: Request, res: Response, next: NextFunction) => {
	// 		errsole.nestExpressProxyMiddleware("/errsole", req, res, next);
	// 	});
	// }

	app.enableCors();

	app.use(helmet());

	const config = new DocumentBuilder()
		.setTitle("Games API Documentation")
		.setDescription("Games API Documentation")
		.setVersion("3.0")
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);

	app.use(
		"/reference",
		apiReference({
			spec: {
				content: document,
			},
		}),
	);

	SwaggerModule.setup("docs", app, document);

	const PORT = process.env.PORT || 3000;

	await app.listen(PORT, () => {
		console.log(`\n\n...api.games.alexgalhardo.com server running on => http://localhost:${PORT}`);

		console.log(`\n\n...Using ${process.env.USE_JSON_DATABASE === "true" ? "JSON" : "POSTGRES"} Database!`);

		// if (process.env.ENABLE_ERRSOLE === "true")
		// 	console.log(`\n\n...Errsole web dashboard is running on => http://localhost:${PORT}/errsole\n\n`);
	});
}

bootstrap();
