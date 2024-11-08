import { Database } from "../config/database.config";
export interface PlatformAvailable {
    id: string;
    name: string;
    slug: string;
}
export interface Developer {
    id: string;
    name: string;
    slug: string;
}
export interface Publisher {
    id: string;
    name: string;
    slug: string;
}
export interface Genre {
    id: string;
    name: string;
    slug: string;
}
export interface Game {
    id: string;
    title: string;
    slug: string;
    cover_image: string;
    summary: string;
    release_year: number;
    igdb: {
        id: number;
        url: string;
        rating: number;
    };
    developer: Developer;
    publisher: Publisher;
    platforms_available: PlatformAvailable[];
    genres: Genre[];
}
export interface GamesRepositoryPort {
    transformToGameResponse(game: any): Game;
    transformToGamesResponses(game: any): Game[];
    findById(gameId: string): Promise<Game>;
    getByTitle(gameTitle: string): Promise<Game[]>;
    getRandom(): Promise<Game>;
}
export default class GamesRepository implements GamesRepositoryPort {
    private games;
    private readonly database;
    constructor(games: Game[], database: Database);
    transformToGameResponse(game: any): Game;
    transformToGamesResponses(games: any): Game[];
    findById(gameId: string): Promise<Game>;
    getByTitle(gameTitle: string): Promise<Game[]>;
    getRandom(): Promise<Game>;
}
