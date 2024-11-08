"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const stringSimilarity = require("string-similarity");
const gamesDatabase = require("./jsons/games.json");
const common_1 = require("@nestjs/common");
const database_config_1 = require("../config/database.config");
const errors_messages_util_1 = require("../utils/errors-messages.util");
let GamesRepository = class GamesRepository {
    constructor(games = gamesDatabase, database) {
        this.games = games;
        this.database = database;
    }
    transformToGameResponse(game) {
        return {
            id: game.id,
            title: game.title,
            slug: game.slug,
            cover_image: game.cover_image,
            summary: game.summary,
            release_year: game.release_year,
            igdb: {
                id: game.igdb_id,
                url: game.igdb_url,
                rating: game.igdb_rating,
            },
            developer: {
                id: game.developer_id,
                name: game.developer_name,
                slug: game.developer_slug,
            },
            publisher: {
                id: game.publisher_id,
                name: game.publisher_name,
                slug: game.publisher_slug,
            },
            platforms_available: JSON.parse(game.platforms_available),
            genres: JSON.parse(game.genres),
        };
    }
    transformToGamesResponses(games) {
        return games.map((game) => {
            return {
                id: game.id,
                title: game.title,
                slug: game.slug,
                cover_image: game.cover_image,
                summary: game.summary,
                release_year: game.release_year,
                igdb: {
                    id: game.igdb_id,
                    url: game.igdb_url,
                    rating: game.igdb_rating,
                },
                developer: {
                    id: game.developer_id,
                    name: game.developer_name,
                    slug: game.developer_slug,
                },
                publisher: {
                    id: game.publisher_id,
                    name: game.publisher_name,
                    slug: game.publisher_slug,
                },
                platforms_available: JSON.parse(game.platforms_available),
                genres: JSON.parse(game.genres),
            };
        });
    }
    async findById(gameId) {
        if (process.env.USE_JSON_DATABASE === "true") {
            return this.games.filter((game) => game.id === gameId)[0];
        }
        const game = await this.database.games.findUnique({
            where: {
                id: gameId,
            },
        });
        if (game)
            return this.transformToGameResponse(game);
        throw new Error(errors_messages_util_1.ErrorsMessages.GAME_NOT_FOUND);
    }
    async getByTitle(gameTitle) {
        if (process.env.USE_JSON_DATABASE === "true") {
            const gamesFound = this.games.filter((game) => game.title.toLowerCase().includes(gameTitle.toLowerCase()));
            const matches = stringSimilarity.findBestMatch(gameTitle, this.games.map((game) => game.title));
            matches.ratings.forEach((similarity) => {
                if (similarity.rating >= 0.5) {
                    if (!gamesFound.some((game) => game.title.toLowerCase() === similarity.target.toLowerCase())) {
                        gamesFound.push(this.games.filter((game) => game.title === similarity.target)[0]);
                    }
                }
            });
            return gamesFound;
        }
        const allGames = await this.database.games.findMany();
        const gamesFound = await this.database.games.findMany({
            where: {
                title: {
                    contains: gameTitle,
                    mode: "insensitive",
                },
            },
        });
        const matches = stringSimilarity.findBestMatch(gameTitle, allGames.map((game) => game.title));
        matches.ratings.forEach((similarity) => {
            if (similarity.rating >= 0.5) {
                if (!gamesFound.some((game) => game.title.toLowerCase() === similarity.target.toLowerCase())) {
                    gamesFound.push(allGames.filter((game) => game.title === similarity.target)[0]);
                }
            }
        });
        return this.transformToGamesResponses(gamesFound);
    }
    async getRandom() {
        if (process.env.USE_JSON_DATABASE === "true") {
            return this.games[Math.floor(Math.random() * this.games.length)];
        }
        const games = this.transformToGamesResponses(await this.database.games.findMany());
        return games[Math.floor(Math.random() * games.length)];
    }
};
GamesRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Array, database_config_1.Database])
], GamesRepository);
exports.default = GamesRepository;
//# sourceMappingURL=games.repository.js.map