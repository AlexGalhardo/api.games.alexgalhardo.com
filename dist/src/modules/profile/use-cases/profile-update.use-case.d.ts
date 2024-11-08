import { UsersRepositoryPort, UserUpdated } from "../../../repositories/users.repository";
import { ProfileUpdateBodyDTO } from "src/modules/profile/dtos/profile-update.swagger";
interface ProfileUpdateUseCaseResponse {
    success: boolean;
    data?: UserUpdated;
}
export interface ProfileUpdateUseCasePort {
    execute(jwtToken: string, profileUpdateDTO: ProfileUpdateBodyDTO): Promise<ProfileUpdateUseCaseResponse>;
}
export default class ProfileUpdateUseCase implements ProfileUpdateUseCasePort {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepositoryPort);
    execute(jwtToken: string, profileUpdateDTO: ProfileUpdateBodyDTO): Promise<ProfileUpdateUseCaseResponse>;
}
export {};
