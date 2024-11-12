import { CompactEncrypt } from "jose";
import { getJWEKeysFromEnv } from "./get-jwe-keys-from-env.util";
import DateTime from "./date-time.util";

export default async function createAuthToken(user: { id: string; email: string }): Promise<string> {
	const { JWE_PUBLIC_KEY } = await getJWEKeysFromEnv();
	const encoder = new TextEncoder();
	const encodedPayload = encoder.encode(
		JSON.stringify({ user_id: user.id, user_email: user.email, expires_at: DateTime.getThirtyMinutesFromNow }),
	);

	return await new CompactEncrypt(encodedPayload)
		.setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
		.encrypt(JWE_PUBLIC_KEY);
}
