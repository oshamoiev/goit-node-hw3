import { randomUUID } from "node:crypto";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/client.ts";
import { config } from "../config.ts";
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from "../constants/time.ts";

export const createTokens = async (userId: number) => {
  const accessToken = createAccessToken(userId);
  const refreshToken = createRefreshToken(userId);

  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
    },
  });

  return { accessToken, refreshToken };
};

export const refreshTokens = async (token: string) => {
  try {
    verifyRefreshToken(token);
  } catch {
    throw createHttpError(401, "Invalid refresh token");
  }

  const storedRefreshToken = await prisma.refreshToken.findUnique({ where: { token } });

  if (!storedRefreshToken) {
    throw createHttpError(401, "Invalid refresh token");
  }

  await prisma.refreshToken.delete({ where: { id: storedRefreshToken.id } });

  const accessToken = createAccessToken(storedRefreshToken.userId);
  const refreshToken = createRefreshToken(storedRefreshToken.userId);

  await prisma.refreshToken.create({
    data: {
      userId: storedRefreshToken.userId,
      token: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
    },
  });

  return { accessToken, refreshToken };
};

export const getAccessTokenPayload = (token: string) =>
  jwt.verify(token, config.accessTokenSecret) as jwt.JwtPayload;

const verifyRefreshToken = (token: string): void => {
  jwt.verify(token, config.refreshTokenSecret);
};

const createAccessToken = (userId: number) =>
  jwt.sign({ sub: String(userId) }, config.accessTokenSecret, {
    expiresIn: ACCESS_TOKEN_LIFETIME / 1000,
  });

const createRefreshToken = (userId: number) =>
  jwt.sign({ sub: String(userId), jti: randomUUID() }, config.refreshTokenSecret, {
    expiresIn: REFRESH_TOKEN_LIFETIME / 1000,
  });
