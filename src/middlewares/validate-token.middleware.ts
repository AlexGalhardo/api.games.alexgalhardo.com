import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";
import { ErrorsMessages } from "../utils/errors-messages.util";

@Injectable()
export class ValidateToken implements NestMiddleware {
    use(req: FastifyRequest["raw"], res: FastifyReply["raw"], next: () => void) {
        const authorization = req.headers.authorizaton as string;

        if (!authorization || !authorization.startsWith("Bearer") || !authorization.split(" ")[1]) {
            return (
                res
                    // .status(HttpStatus.BAD_REQUEST)
                    .end(
                        JSON.stringify({
                            success: false,
                            error: ErrorsMessages.MISSING_HEADER_AUTHORIZATION_BEARER_TOKEN,
                        }),
                    )
            );
        }

        const token = authorization.split(" ")[1];

        req.headers["token"] = token;

        console.log("req.headers['token'] => ", req.headers["token"]);

        next();
    }
}
