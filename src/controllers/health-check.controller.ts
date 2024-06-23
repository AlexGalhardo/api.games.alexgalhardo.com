import { Controller, Res, HttpStatus, Get } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { HealthCheck } from "../entities/health-check";

@Controller()
@ApiTags("health-check")
export class HealthCheckController {
    @Get("/")
    @ApiResponse({ status: 200, type: HealthCheck })
    async login(@Res() response: Response) {
        return response.status(HttpStatus.OK).json({
            success: true,
            message: "Nerd API is on, lets goo!",
            docs: "https://docs.nerdapi.com",
            source_code: "https://github.com/alexgalhardo/api.nerdapi.com",
            front_end: "https://nerdapi.com",
            author: "https://github.com/alexgalhardo",
            games_endpoints: {
                "GET Random Game": "https://api.nerdapi.com/games/random",
                "GET Game by Id": "https://api.nerdapi.com/games/id/{game_id}",
                "GET Game by title": "https://api.nerdapi.com/games/title/{game_title}",
            },
        });
    }
}
