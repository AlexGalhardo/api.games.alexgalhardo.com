import { PrismaClient } from "@prisma/client";
import * as gamesJSONDatabase from "../src/repositories/jsons/games.json";
import { Bcrypt } from "../src/utils/bcrypt.util";
import GenerateRandomToken from "../src/utils/generate-random-token.util";
import { generatePhoneNumber } from "src/utils/generate-phone-number.util";

const prisma = new PrismaClient({
	errorFormat: "pretty",
});

const gamesToSeedDatabase: any[] = [];

gamesJSONDatabase.forEach((game) => {
	gamesToSeedDatabase.push({
		title: game.title,
		slug: game.slug,
		cover_image: game.cover_image,
		summary: game.summary,
		release_year: game.release_year ?? 2030,
		igdb_id: game.igdb.id,
		igdb_url: game.igdb.url,
		igdb_rating: game.igdb.rating ?? 1,
		developer_id: typeof game.developer.id === 'string' ? 999 : game.developer.id,
		developer_name: game.developer.name,
		developer_slug: game.developer.slug,
		publisher_id: typeof game.publisher.id === 'string' ? 999 : game.publisher.id,
		publisher_name: game.publisher.name,
		publisher_slug: game.publisher.slug,
		platforms_available: JSON.stringify(game.platforms_available),
		genres: JSON.stringify(game.genres),
	});
});

const seedDatabase = async () => {
	await prisma.users.deleteMany({});
	await prisma.games.deleteMany({});

	await prisma.users.createMany({
		data: [
			{
				name: "ADMIN",
				email: "admin@gmail.com",
				phone_number: generatePhoneNumber(),
				auth_token: null,
				api_key: "api_key_admin",
				password: await Bcrypt.hash("testADMIN!123"),
				reset_password_token: null,
				reset_password_token_expires_at: null,
				stripe_customer_id: null,
				stripe_subscription_active: false,
				stripe_subscription_name: "NOOB",
				stripe_subscription_starts_at: null,
				stripe_subscription_ends_at: null,
				stripe_subscription_charge_id: null,
				stripe_subscription_receipt_url: null,
				stripe_subscription_hosted_invoice_url: null,
				stripe_updated_at: null,
				created_at: new Date(),
				updated_at: null,
				deleted_at: null
			},
			{
				name: "TEST USER",
				email: "test@gmail.com",
				phone_number: generatePhoneNumber(),
				auth_token: null,
				api_key: GenerateRandomToken(),
				password: await Bcrypt.hash("testUSER!123"),
				reset_password_token: null,
				reset_password_token_expires_at: null,
				stripe_customer_id: null,
				stripe_subscription_active: false,
				stripe_subscription_name: "NOOB",
				stripe_subscription_starts_at: null,
				stripe_subscription_ends_at: null,
				stripe_subscription_charge_id: null,
				stripe_subscription_receipt_url: null,
				stripe_subscription_hosted_invoice_url: null,
				stripe_updated_at: null,
				created_at: new Date(),
				updated_at: null,
				deleted_at: null
			},
		],
		skipDuplicates: true,
	});

	await prisma.games.createMany({
		data: gamesToSeedDatabase,
		skipDuplicates: true,
	});
};

seedDatabase();
