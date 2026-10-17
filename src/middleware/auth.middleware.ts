import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { getAccessTokenPayload } from "../services/token.service.ts";

declare global {
  namespace Express {
    interface Request {
      auth: { userId: number };
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
    const payload = getAccessTokenPayload(accessToken);
    const userId = Number(payload.sub);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      throw createHttpError(401, "Invalid token subject");
    }

    req.auth = { userId };
    next();
  } catch (_error) {
    throw createHttpError(401, "Invalid or expired access token");
  }
};

export default authMiddleware;
