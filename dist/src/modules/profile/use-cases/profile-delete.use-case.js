"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_messages_util_1 = require("../../../utils/errors-messages.util");
class ProfileDeleteUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute(email) {
        if (this.usersRepository.findByEmail(email)) {
            await this.usersRepository.deleteByEmail(email);
            return { success: true };
        }
        throw new Error(errors_messages_util_1.ErrorsMessages.USER_NOT_FOUND);
    }
}
exports.default = ProfileDeleteUseCase;
//# sourceMappingURL=profile-delete.use-case.js.map