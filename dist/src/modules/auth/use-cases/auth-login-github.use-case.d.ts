import { UsersRepositoryPort } from "../../../repositories/users.repository";
import { Request } from "express";
export interface AuthLoginGitHubUseCasePort {
    execute(request: Request): Promise<AuthLoginGitHubUseCaseResponse>;
}
export interface AuthLoginDTO {
    email: string;
    password: string;
}
interface AuthLoginGitHubUseCaseResponse {
    success: boolean;
    redirect: string;
    jwt_token?: string;
}
export default class AuthLoginGitHubUseCase implements AuthLoginGitHubUseCasePort {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepositoryPort);
    execute(request: Request): Promise<AuthLoginGitHubUseCaseResponse>;
}
export {};
