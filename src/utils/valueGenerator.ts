import { v4 as uuidv4 } from 'uuid'

export function generateUniqueString(): string {
  const seconds = Math.floor(Date.now());
  return `${seconds}`;
}

export function generateRandomEmail(domain: string = 'example.com'): string {
  return `user_${generateUniqueString()}@${domain}`;
}

export function generateRandomString(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = ''; 
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export const generateIdempotencyKey = (): string => uuidv4();

