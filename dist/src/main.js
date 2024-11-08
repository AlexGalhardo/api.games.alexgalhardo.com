"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const verify_envs_util_1 = require("./utils/verify-envs.util");
(0, verify_envs_util_1.default)();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.use((0, helmet_1.default)());
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Games API Documentation")
        .setDescription("Games API Documentation")
        .setVersion("3.0")
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("docs", app, document);
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT, () => {
        console.log(`\n\n...api.games.alexgalhardo.com server running on => http://localhost:${PORT}`);
        console.log(`\n\n...Using ${process.env.USE_JSON_DATABASE === "true" ? "JSON" : "POSTGRES"} Database!`);
        if (process.env.ENABLE_ERRSOLE === "true")
            console.log(`\n\n...Errsole web dashboard is running on => http://localhost:${PORT}/errsole\n\n`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map