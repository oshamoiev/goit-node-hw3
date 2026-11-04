import { unlink } from "node:fs/promises";
import type { NextFunction, Request, Response } from "express";

const cleanupUpload = (req: Request, res: Response, next: NextFunction) => {
  const filePath = req.file?.path;

  if (filePath) {
    let cleaned = false;

    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;

      void unlink(filePath).catch((error: unknown) => {
        req.log.warn({ err: error }, "Failed to remove temporary upload");
      });
    };

    res.once("finish", cleanup);
    res.once("close", cleanup);
  }

  next();
};

export default cleanupUpload;
