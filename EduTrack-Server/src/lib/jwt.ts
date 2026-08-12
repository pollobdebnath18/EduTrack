import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JwtPayload {
  userId: string;
}

const getSecret = (): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in the environment");
  }
  return JWT_SECRET;
};

export const signToken = (userId: string): string => {
  return jwt.sign({ userId }, getSecret(), { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getSecret()) as JwtPayload;
};

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};