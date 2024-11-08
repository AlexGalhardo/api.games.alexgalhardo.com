import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as bodyParser from "body-parser";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import errsole from "errsole";
import ErrsolePostgres from "errsole-postgres";
import { NextFunction } from "express";
import verifyEnvs from "./utils/verify-envs.util";

verifyEnvs();

errsole.initialize({
	storage: new ErrsolePostgres({
		host: process.env.DATABASE_HOST,
		user: process.env.DATABASE_USERNAME,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
	}),
});

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(bodyParser.json());
	app.use("/errsole", (req: Request, res: Response, next: NextFunction) => {
		errsole.nestExpressProxyMiddleware("/errsole", req, res, next);
	});

	app.enableCors();

	app.use(helmet());

	const config = new DocumentBuilder()
		.setTitle("Example")
		.setDescription("games.alexgalhardo.com  API Documentation")
		.setVersion("1.0")
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("docs", app, document);

	await app.listen(Number(process.env.SERVER_PORT) || 3000, "0.0.0.0", () => {
		console.log(
			`\n\n...api.games.alexgalhardo.com server running on => http://localhost:${Number(process.env.SERVER_PORT) || 3000}`,
		);
		console.log(`\n\n...Using ${process.env.USE_JSON_DATABASE === "true" ? "JSON" : "DOCKER POSTGRES"} Database!`);
		console.log(
			`\n\n...Errsole web dashboard is running on => http://localhost:${Number(process.env.SERVER_PORT) || 3000}/errsole\n\n`,
		);
	});
}

bootstrap();
