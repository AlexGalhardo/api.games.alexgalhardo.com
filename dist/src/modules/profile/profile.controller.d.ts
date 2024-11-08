import { Response } from "express";
import { ProfileResponse } from "src/modules/profile/dtos/profile-response.swagger";
import { ProfileUpdateBodyDTO } from "./dtos/profile-update.swagger";
import { ProfileUpdateUseCasePort } from "./use-cases/profile-update.use-case";
interface ProfileControllerPort {
    update(profileUpdateDTO: ProfileUpdateBodyDTO, response: Response): Promise<Response<ProfileResponse>>;
}
export declare class ProfileController implements ProfileControllerPort {
    private readonly profileUpdateUseCase;
    constructor(profileUpdateUseCase: ProfileUpdateUseCasePort);
    update(profileUpdatePayload: ProfileUpdateBodyDTO, response: Response): Promise<Response<ProfileResponse>>;
}
export {};
