import * as stringSimilarity from "string-similarity";
import * as gamesDatabase from "./jsons/games.json";
import { Injectable } from "@nestjs/common";
import { Database } from "../config/database.config";
import { ErrorsMessages } from "../utils/errors-messages.util";

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
	transformToGameResponse(game): Game;
	transformToGamesResponses(game): Game[];
	findById(gameId: string): Promise<Game>;
	getByTitle(gameTitle: string): Promise<Game[]>;
	getRandom(): Promise<Game>;
}

@Injectable()
export default class GamesRepository implements GamesRepositoryPort {
	constructor(
		private games: Game[] = gamesDatabase,
		private readonly database: Database,
	) {}

	public transformToGameResponse(game): Game {
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

	public transformToGamesResponses(games): Game[] {
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

	public async findById(gameId: string): Promise<Game> {
		if (process.env.USE_JSON_DATABASE === "true") {
			return this.games.filter((game: Game) => game.id === gameId)[0];
		}

		const game = await this.database.games.findUnique({
			where: {
				id: gameId,
			},
		});

		if (game) return this.transformToGameResponse(game);

		throw new Error(ErrorsMessages.GAME_NOT_FOUND);
	}

	public async getByTitle(gameTitle: string): Promise<Game[]> {
		if (process.env.USE_JSON_DATABASE === "true") {
			const gamesFound = this.games.filter((game: Game) =>
				game.title.toLowerCase().includes(gameTitle.toLowerCase()),
			);

			const matches = stringSimilarity.findBestMatch(
				gameTitle,
				this.games.map((game) => game.title),
			);

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
					mode: "insensitive", // default
				},
			},
		});

		const matches = stringSimilarity.findBestMatch(
			gameTitle,
			allGames.map((game) => game.title),
		);

		matches.ratings.forEach((similarity) => {
			if (similarity.rating >= 0.5) {
				if (!gamesFound.some((game) => game.title.toLowerCase() === similarity.target.toLowerCase())) {
					gamesFound.push(allGames.filter((game) => game.title === similarity.target)[0]);
				}
			}
		});

		return this.transformToGamesResponses(gamesFound);
	}

	public async getRandom(): Promise<Game> {
		if (process.env.USE_JSON_DATABASE === "true") {
			return this.games[Math.floor(Math.random() * this.games.length)];
		}

		const games = this.transformToGamesResponses(await this.database.games.findMany());
		return games[Math.floor(Math.random() * games.length)];
	}
}
