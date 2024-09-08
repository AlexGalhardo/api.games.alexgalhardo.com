import { Controller, Res, HttpStatus, Get } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { HealthCheckResponse } from "../swagger/health-check.swagger";
import { API_URL } from "src/utils/constants.util";

@Controller()
@ApiTags("health-check")
export class HealthCheckController {
    @Get("/")
    @ApiResponse({ status: 200, type: HealthCheckResponse })
    async login(@Res() response: Response) {
        return response.status(HttpStatus.OK).json({
            success: true,
            message: "API is up and running, lets goo!",
            swagger: `${API_URL}/api`,
            docs: "https://docs.games.alexgalhardo.com",
            source_code: "https://github.com/alexgalhardo/api.games.alexgalhardo.com",
            front_end: "https://games.alexgalhardo.com",
            games_endpoints: {
                "GET Random Game": "https://api.games.alexgalhardo.com/games/random",
                "GET Game by Id": "https://api.games.alexgalhardo.com/games/id/{game_id}",
                "GET Game by title": "https://api.games.alexgalhardo.com/games/title/{game_title}",
            },
        });
    }
}
