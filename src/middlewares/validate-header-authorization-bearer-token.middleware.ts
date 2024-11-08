import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ErrorsMessages } from "../utils/errors-messages.util";
import { compactDecrypt } from "jose";
import { TextDecoder } from "util";
import { getJWEKeysFromEnv } from "src/utils/get-jwe-keys-from-env.util";

@Injectable()
export class ValidateHeaderAuthorizationBearerToken implements NestMiddleware {
	async use(request: Request, response: Response, next: NextFunction) {
		if (
			!request.headers?.authorization ||
			!request.headers.authorization.startsWith("Bearer") ||
			!request.headers.authorization.split(" ")[1]
		) {
			return response
				.status(HttpStatus.BAD_REQUEST)
				.json({ success: false, error: ErrorsMessages.MISSING_HEADER_AUTHORIZATION_BEARER_TOKEN });
		}

		const bearerToken = request.headers.authorization.split(" ")[1];

		if (bearerToken.includes("api_key_")) {
			response.locals.api_key = bearerToken;
			next();
		}

		console.log("bearer token jwe -> ", bearerToken);

		const { JWE_PRIVATE_KEY } = await getJWEKeysFromEnv();
		console.log("JWE_PRIVATE_KEY -> ", JWE_PRIVATE_KEY);
		const { plaintext } = await compactDecrypt(bearerToken, JWE_PRIVATE_KEY);
		const decodedJWE = JSON.parse(new TextDecoder().decode(plaintext));

		console.log("decodedJWE -> ", decodedJWE);

		response.locals.auth = { user_id: decodedJWE.user_id, user_email: decodedJWE.user_email };

		next();
	}
}
