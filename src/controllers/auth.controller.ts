import type { Request, Response } from "express";
import createHttpError from "http-errors";
import { REFRESH_TOKEN_LIFETIME } from "../constants/time.ts";
import {
  findUserById,
  loginUser,
  registerUser,
  removeRefreshToken,
  rotateRefreshToken,
} from "../services/auth.service.ts";
import type { LoginBody, RegisterBody } from "../validators/auth.validator.ts";

const REFRESH_TOKEN_COOKIE = "refreshToken";

export const register = async (
  req: Request<Record<string, string>, unknown, RegisterBody>,
  res: Response,
) => {
  const { user, tokens } = await registerUser(req.body);

  setRefreshTokenCookie(res, tokens.refreshToken);

  res.status(201).json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    },
  });
};

export const login = async (
  req: Request<Record<string, string>, unknown, LoginBody>,
  res: Response,
) => {
  const { user, tokens } = await loginUser(req.body);

  setRefreshTokenCookie(res, tokens.refreshToken);

  res.status(200).json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    },
  });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshTokenString =
    req.cookies.refreshToken || (req.body as { refreshToken?: string }).refreshToken;

  if (!refreshTokenString) {
    throw createHttpError(401, "Refresh token not provided");
  }

  const tokens = await rotateRefreshToken(refreshTokenString);

  setRefreshTokenCookie(res, tokens.refreshToken);

  res.status(200).json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
};

export const logout = async (req: Request, res: Response) => {
  const refreshTokenString =
    req.cookies.refreshToken || (req.body as { refreshToken?: string }).refreshToken;

  if (!refreshTokenString) {
    throw createHttpError(400, "Refresh token not provided");
  }

  await removeRefreshToken(refreshTokenString);
  removeRefreshTokenCookie(res);

  res.status(204).end();
};

export const me = async (req: Request, res: Response) => {
  const subject = req.accessTokenPayload?.sub;

  if (typeof subject !== "string") {
    throw createHttpError(401, "Invalid token subject");
  }

  const userId = Number(subject);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw createHttpError(401, "Invalid token subject");
  }

  const user = await findUserById(userId);

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  res.status(200).json({
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
  });
};

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_LIFETIME,
  });
};

const removeRefreshTokenCookie = (res: Response) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};
