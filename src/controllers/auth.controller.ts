import type { Request, Response } from "express";
import createHttpError from "http-errors";
import { REFRESH_TOKEN_LIFETIME } from "../constants/time.ts";
import { loginUser, registerUser, rotateRefreshToken } from "../services/auth.service.ts";
import type { LoginBody, RegisterBody } from "../validators/auth.validator.ts";

export const register = async (
  req: Request<Record<string, string>, unknown, RegisterBody>,
  res: Response,
) => {
  const { user, tokens } = await registerUser(req.body);

  setRefreshTokenCookie(res, tokens.refreshToken);

  res.status(201).json({
    accessToken: tokens.accessToken,
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

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_LIFETIME,
  });
};
