import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import type jwt from "jsonwebtoken";
import { getAccessTokenPayload } from "../services/token.service.ts";

declare global {
  namespace Express {
    interface Request {
      accessTokenPayload?: jwt.JwtPayload;
    }
  }
}

const authMiddleware = (
  req: Request<Record<string, string>, unknown, unknown>,
  _res: Response,
  next: NextFunction,
) => {
  const accessToken = req.headers.authorization?.replace("Bearer ", "");

  if (!accessToken) {
    throw createHttpError(401, "Authentication required");
  }

  try {
    req.accessTokenPayload = getAccessTokenPayload(accessToken);
    next();
  } catch (_error) {
    throw createHttpError(401, "Invalid or expired access token");
  }
};

export default authMiddleware;
