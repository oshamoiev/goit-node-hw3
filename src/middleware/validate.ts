import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validateBody =
  <T extends z.ZodTypeAny>(schema: T) =>
  (
    req: Request<Record<string, string>, unknown, z.infer<T>>,
    res: Response,
    next: NextFunction,
  ) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(422).json({
        error: "Validation failed",
        details: z.flattenError(result.error),
      });
    }

    req.body = result.data;
    next();
  };
