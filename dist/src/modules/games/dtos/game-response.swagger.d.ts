import { Game } from "src/repositories/games.repository";
export declare class GamesResponse {
    success: boolean;
    error?: string;
    data?: Game | Game[];
    api_requests_today?: number;
}
