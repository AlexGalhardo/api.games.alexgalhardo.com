import { Injectable, NestMiddleware } from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";
import { ErrorsMessages } from "../utils/errors-messages.util";

@Injectable()
export class ValidateToken implements NestMiddleware {
    use(request: FastifyRequest["raw"], response: FastifyReply["raw"], next: () => void) {
        const authorization = request.headers["authorization"];

        if (!authorization || !authorization.startsWith("Bearer") || !authorization.split(" ")[1]) {
            return (
                response
                    // .status(400)
                    .end(
                        JSON.stringify({
                            success: false,
                            error: ErrorsMessages.MISSING_HEADER_AUTHORIZATION_BEARER_TOKEN,
                        }),
                    )
            );
        }

        const token = authorization.split(" ")[1];

        request.headers["token"] = token;

        next();
    }
}
