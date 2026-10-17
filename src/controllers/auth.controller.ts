import type { Request, Response } from "express";
import createHttpError from "http-errors";
import * as authService from "../services/auth.service.ts";
import type {
  LoginBody,
  LogoutBody,
  RefreshBody,
  RegisterBody,
} from "../validators/auth.validator.ts";

export const register = async (
  req: Request<Record<string, string>, unknown, RegisterBody>,
  res: Response,
) => {
  const { user, tokens } = await authService.registerUser(req.body);

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
  const { user, tokens } = await authService.loginUser(req.body);

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

export const refresh = async (
  req: Request<Record<string, string>, unknown, RefreshBody>,
  res: Response,
) => {
  const tokens = await authService.refreshTokens(req.body.refreshToken);

  res.status(200).json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
};

export const logout = async (
  req: Request<Record<string, string>, unknown, LogoutBody>,
  res: Response,
) => {
  await authService.removeRefreshToken(req.auth.userId, req.body.refreshToken);
  res.status(204).end();
};

export const me = async (req: Request, res: Response) => {
  const user = await authService.findUserById(req.auth.userId);

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  res.status(200).json({
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  });
};
