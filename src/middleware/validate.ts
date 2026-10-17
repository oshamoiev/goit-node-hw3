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

export const validateParams =
  <T extends z.ZodTypeAny>(schema: T) =>
  (req: Request<z.infer<T>>, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid parameters",
        details: z.flattenError(result.error).fieldErrors,
      });
    }

    req.params = result.data;
    next();
  };

export const validateQuery =
  <T extends z.ZodTypeAny>(schema: T) =>
  (req: Request, res: Response<unknown, { query: z.infer<T> }>, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid query parameters",
        details: z.flattenError(result.error).fieldErrors,
      });
    }

    res.locals.query = result.data;
    next();
  };
