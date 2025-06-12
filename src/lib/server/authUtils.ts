import { hash, verify } from '@node-rs/argon2';

/**
 * Hashes a plain-text password using Argon2.
 * @param password The plain-text password.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
	return await hash(password, {
		// Recommended Argon2id parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
};

/**
 * Verifies a plain-text password against a stored hash.
 * @param password The plain-text password to verify.
 * @param hashedPassword The stored hash to compare against.
 * @returns A promise that resolves to true if the password is valid, otherwise false.
 */
export const verifyPassword = async (
	password: string,
	hashedPassword: string
): Promise<boolean> => {
	try {
		return await verify(hashedPassword, password);
	} catch (e) {
		console.error("Error during password verification:", e);
		return false;
	}
};