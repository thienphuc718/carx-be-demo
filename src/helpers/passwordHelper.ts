import * as bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '../constants';

export function generatePassword(defaultLength = 8): string {
  const generatedPassword =
    Math.random()
      .toString(36)
      .slice(2) +
    Math.random()
      .toString(36)
      .toUpperCase()
      .slice(2);
  return generatedPassword.slice(0, defaultLength);
}

export function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function hashingPassword(password: string): Promise<string> {
  const salt: string = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword: string = await bcrypt.hash(password, salt);
  return hashedPassword;
}
