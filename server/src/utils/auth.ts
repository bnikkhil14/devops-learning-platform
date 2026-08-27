import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables');
}

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
export const generateToken = (userId: string): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign({ userId }, JWT_SECRET, options);
};

export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};