import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>("roles", context.getHandler());
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!roles || !roles.length) {
            return true;
        }

        if (roles.includes(user?.roles)) {
            return true;
        }

        const isCorbanAssistant = user.roles.includes("MANAGER") && user.is_assistant;
        if (roles.includes("ADMIN") && isCorbanAssistant) {
            return true;
        }

        throw new UnauthorizedException("User role not authorized");
    }
}

export { RolesGuard };
