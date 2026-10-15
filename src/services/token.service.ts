import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.ts";
import { config } from "../config.ts";
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from "../constants/time.ts";

export const createTokens = async (userId: number) => {
  const accessToken = createAccessToken(userId);
  const refreshToken = createRefreshToken();

  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
    },
  });

  return { accessToken, refreshToken };
};

const createAccessToken = (userId: number) => {
  return jwt.sign({ sub: String(userId) }, config.jwtSecret, {
    expiresIn: ACCESS_TOKEN_LIFETIME / 1000,
  });
};

const createRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};
