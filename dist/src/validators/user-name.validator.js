"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UsernameValidator {
    static isValidSingleName(name) {
        if (!name || name.length <= 3)
            return false;
        const regexOfValidNamesWithAcents = /^[a-zA-ZÀ-ú]+$/g;
        return regexOfValidNamesWithAcents.test(name);
    }
    static validate(fullName) {
        const names = fullName.split(" ");
        if (names.length > 1) {
            for (const name of names) {
                if (!this.isValidSingleName(name))
                    return false;
            }
        }
        else {
            if (!this.isValidSingleName(fullName))
                return false;
            return true;
        }
        return true;
    }
    static capitalize(fullName) {
        if (!this.validate(fullName))
            throw new Error("Invalid person name");
        const arr = fullName.toLowerCase().split(" "), prepositions = ["da", "de", "do", "das", "dos", "e"];
        for (let i = 0; i < arr.length; i++) {
            arr[i] = !prepositions.includes(arr[i]) ? arr[i].charAt(0).toUpperCase() + arr[i].slice(1) : arr[i];
        }
        return arr.join(" ");
    }
}
exports.default = UsernameValidator;
//# sourceMappingURL=user-name.validator.js.map