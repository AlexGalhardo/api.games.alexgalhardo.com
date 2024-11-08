export default class PhoneValidator {
    static validate(phone: string): boolean;
    static getStateByPhone(phone: string): string;
    static getStateByDDD(ddd: string): string;
    static extractNumbers(phone: string): string;
    static extractDDD(phone: string): string;
    static extractNumber(phone: string): string;
    static generate(): string;
}
