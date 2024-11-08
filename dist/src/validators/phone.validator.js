"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_util_1 = require("../utils/constants.util");
class PhoneValidator {
    static validate(phone) {
        phone = phone.replace(/\D/g, "");
        if (phone.length !== 13)
            return false;
        if (parseInt(phone.substring(4, 5)) !== 9)
            return false;
        if (new Set(phone).size === 1)
            return false;
        if (constants_util_1.BRAZIL_VALID_PHONE_DDD.indexOf(parseInt(phone.substring(2, 4))) == -1)
            return false;
        return true;
    }
    static getStateByPhone(phone) {
        return this.getStateByDDD(this.extractDDD(phone));
    }
    static getStateByDDD(ddd) {
        return constants_util_1.BRAZIL_STATE_SYMBOL_BY_DDD[ddd];
    }
    static extractNumbers(phone) {
        return phone.replace(/\D/g, "");
    }
    static extractDDD(phone) {
        return this.extractNumbers(phone).substring(0, 2);
    }
    static extractNumber(phone) {
        return this.extractNumbers(phone).substring(2);
    }
    static generate() {
        const prefix = "55";
        const areaCode = constants_util_1.BRAZIL_VALID_PHONE_DDD[Math.floor(Math.random() * constants_util_1.BRAZIL_VALID_PHONE_DDD.length)];
        const middleNumbers = "99";
        const randomNumbers = Math.floor(Math.random() * 10000000)
            .toString()
            .padStart(7, "0");
        const phoneNumber = `${prefix}${areaCode}${middleNumbers}${randomNumbers}`;
        return phoneNumber;
    }
}
exports.default = PhoneValidator;
//# sourceMappingURL=phone.validator.js.map