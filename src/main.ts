import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors();

	app.use(helmet());

	const config = new DocumentBuilder()
		.setTitle("Example")
		.setDescription("The Nerd API Documentation")
		.setVersion("1.0")
		.addTag("example")
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("api", app, document);

	await app.listen(Number(process.env.PORT) || 3000, "0.0.0.0", () => {
		console.log(`\n\napi.games.alexgalhardo.com running on http://localhost:${Number(process.env.PORT) || 3000}`);
		console.log(
			`\n\n...Using ${process.env.USE_JSON_DATABASE === "true" ? "JSON" : "DOCKER POSTGRES"} Database!\n\n`,
		);
	});
}

bootstrap();
