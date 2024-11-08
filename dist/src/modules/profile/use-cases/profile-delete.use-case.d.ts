import { UsersRepositoryPort } from "../../../repositories/users.repository";
interface ProfileDeleteUseCaseResponse {
    success: boolean;
    jwt_token?: string;
}
export interface ProfileDeleteUseCasePort {
    execute(email: string): Promise<ProfileDeleteUseCaseResponse>;
}
export default class ProfileDeleteUseCase implements ProfileDeleteUseCasePort {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepositoryPort);
    execute(email: string): Promise<ProfileDeleteUseCaseResponse>;
}
export {};
