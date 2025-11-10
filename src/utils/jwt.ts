import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

type JwtPayload = {
  userId: string;
  username: string;
  role: string;
};

const secret: Secret = env.jwtSecret;
const signOptions: SignOptions = {
  expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
};

export const signJwt = (payload: JwtPayload) =>
  jwt.sign(payload, secret, signOptions);

export const verifyJwt = (token: string): JwtPayload =>
  jwt.verify(token, secret) as JwtPayload;

