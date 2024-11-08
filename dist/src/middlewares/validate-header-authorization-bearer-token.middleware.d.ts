import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
export declare class ValidateHeaderAuthorizationBearerToken implements NestMiddleware {
    use(request: Request, response: Response, next: NextFunction): Response<any, Record<string, any>>;
}
