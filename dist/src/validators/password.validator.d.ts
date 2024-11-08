export default class PasswordValidator {
    static isEqual(firstPassword: string, secondPassword: string): boolean;
    static validate(plainTextPasswordToCheck: string): boolean;
    static generate(): string;
}
