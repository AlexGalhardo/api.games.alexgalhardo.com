import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({ logger: true })
	);

	app.enableCors();

	app.use(helmet());

	const config = new DocumentBuilder()
		.setTitle("NerdAPI Swagger Documentation")
		.setDescription("The Nerd API Swagger Documentation")
		.setVersion("2.0")
		.addTag("example")
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("api", app, document);

	await app.listen(Number(process.env.PORT) || 3000, "0.0.0.0", () => {
		console.log(`\n\n...NerdAPI REST API Server running on: http://localhost:${Number(process.env.PORT) || 3000}`);

		console.log(
			`\n\n...Environment: ${process.env.NODE_ENV === "production" ? "PRODUCTION" : "DEVELOPMENT"}`,
		);

		console.log(
			`\n\n...Using Database: ${process.env.USE_JSON_DATABASE === "true" ? "JSON" : "DOCKER POSTGRES"}\n\n`,
		);
	});
}

bootstrap();
