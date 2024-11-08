"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const gamesJSONDatabase = require("../src/repositories/jsons/games.json");
const bcrypt_util_1 = require("../src/utils/bcrypt.util");
const generate_random_token_util_1 = require("../src/utils/generate-random-token.util");
const phone_validator_1 = require("../src/validators/phone.validator");
const prisma = new client_1.PrismaClient({
    errorFormat: "pretty",
});
const gamesToSeedDatabase = [];
gamesJSONDatabase.forEach((game) => {
    var _a, _b;
    gamesToSeedDatabase.push({
        title: game.title,
        slug: game.slug,
        cover_image: game.cover_image,
        summary: game.summary,
        release_year: (_a = game.release_year) !== null && _a !== void 0 ? _a : 2030,
        igdb_id: game.igdb.id,
        igdb_url: game.igdb.url,
        igdb_rating: (_b = game.igdb.rating) !== null && _b !== void 0 ? _b : 1,
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
                phone_number: phone_validator_1.default.generate(),
                jwt_token: null,
                api_key: "api_key_admin",
                password: await bcrypt_util_1.Bcrypt.hash("testADMIN!123"),
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
                phone_number: phone_validator_1.default.generate(),
                jwt_token: null,
                api_key: (0, generate_random_token_util_1.default)(),
                password: await bcrypt_util_1.Bcrypt.hash("testUSER!123"),
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
//# sourceMappingURL=seed.js.map