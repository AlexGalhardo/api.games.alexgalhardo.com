import { Module } from "@nestjs/common";
import { HealthCheckController } from "../controllers/health-check.controller.js";

@Module({
    controllers: [HealthCheckController],
    providers: [],
})
export class HealthCheckModule {}
