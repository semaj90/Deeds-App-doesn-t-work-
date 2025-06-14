import bcrypt from 'bcryptjs';

/**
 * Hashes a plain-text password using Bcrypt.
 * @param password The plain-text password.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verifies a plain-text password against a stored hash.
 * @param password The plain-text password to verify.
 * @param hashedPassword The stored hash to compare against.
 * @returns A promise that resolves to true if the password is valid, otherwise false.
 */
export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}