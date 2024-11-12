import { BRAZIL_VALID_PHONE_DDD } from "../utils/constants.util";

export function generatePhoneNumber(): string {
	const prefix = "55";
	const areaCode = BRAZIL_VALID_PHONE_DDD[Math.floor(Math.random() * BRAZIL_VALID_PHONE_DDD.length)];
	const middleNumbers = "99";
	const randomNumbers = Math.floor(Math.random() * 10000000)
		.toString()
		.padStart(7, "0");

	const phoneNumber = `${prefix}${areaCode}${middleNumbers}${randomNumbers}`;

	return phoneNumber;
}
