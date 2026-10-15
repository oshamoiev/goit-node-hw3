import type { Request, Response } from "express";
import { REFRESH_TOKEN_LIFETIME } from "../constants/time.ts";
import { loginUser, registerUser } from "../services/auth.service.ts";
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

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: REFRESH_TOKEN_LIFETIME,
  });
};
