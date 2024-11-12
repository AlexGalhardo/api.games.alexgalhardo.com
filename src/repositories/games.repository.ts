import * as stringSimilarity from "string-similarity";
import { Injectable } from "@nestjs/common";
import { Database } from "../config/database.config";
import { Game } from "@prisma/client";

export interface GamesRepositoryPort {
	findById(gameId: string): Promise<Game>;
	getByTitle(gameTitle: string): Promise<Game[]>;
	getRandom(): Promise<Game>;
}

@Injectable()
export default class GamesRepository implements GamesRepositoryPort {
	constructor(private readonly database: Database) {}

	public async findById(id: string): Promise<Game> {
		try {
			return await this.database.game.findUnique({
				where: {
					id,
				},
			});
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async getByTitle(gameTitle: string): Promise<Game[]> {
		try {
			const allGames = await this.database.game.findMany();

			const gamesFound = await this.database.game.findMany({
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

			return gamesFound;
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}

	public async getRandom(): Promise<Game> {
		try {
			const games = await this.database.game.findMany();
			return games[Math.floor(Math.random() * games.length)];
		} catch (error: any) {
			throw new Error(error?.message);
		}
	}
}
