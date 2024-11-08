"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
const jwt = require("jsonwebtoken");
const phone_validator_1 = require("../../../validators/phone.validator");
const password_validator_1 = require("../../../validators/password.validator");
const user_name_validator_1 = require("../../../validators/user-name.validator");
class ProfileUpdateUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(jwtToken, profileUpdateDTO) {
        const { userID } = jwt.verify(jwtToken, process.env.JWT_SECRET);
        const { user } = await this.usersRepository.findById(userID);
        if (user) {
            if (profileUpdateDTO.name) {
                if (!user_name_validator_1.default.validate(profileUpdateDTO.name)) {
                    throw new Error(errors_messages_util_1.ErrorsMessages.USERNAME_INVALID);
                }
            }
            if (profileUpdateDTO.phone_number) {
                if (!phone_validator_1.default.validate(profileUpdateDTO.phone_number)) {
                    throw new Error(errors_messages_util_1.ErrorsMessages.INVALID_PHONE_NUMBER);
                }
                if (await this.usersRepository.phoneAlreadyRegistred(user.id, profileUpdateDTO.phone_number)) {
                    throw new Error(errors_messages_util_1.ErrorsMessages.PHONE_NUMBER_ALREADY_REGISTRED);
                }
            }
            if (profileUpdateDTO.newPassword && profileUpdateDTO.confirmNewPassword) {
                if (!password_validator_1.default.isEqual(profileUpdateDTO.newPassword, profileUpdateDTO.confirmNewPassword)) {
                    throw new Error(errors_messages_util_1.ErrorsMessages.PASSWORDS_NOT_EQUAL);
                }
                if (!password_validator_1.default.validate(profileUpdateDTO.newPassword)) {
                    throw new Error(errors_messages_util_1.ErrorsMessages.NEW_PASSWORD_IS_INSECURE);
                }
            }
            const userUpdated = await this.usersRepository.update(userID, profileUpdateDTO);
            return { success: true, data: userUpdated };
        }
        throw new Error(errors_messages_util_1.ErrorsMessages.HEADER_AUTHORIZATION_BEARER_TOKEN_EXPIRED_OR_INVALID);
    }
}
exports.default = ProfileUpdateUseCase;
//# sourceMappingURL=profile-update.use-case.js.map