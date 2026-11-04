import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import * as announcementService from "../services/announcement.service.ts";
import type { AnnouncementIdParams } from "../validators/announcement.validator.ts";

const requireAnnouncementOwner = (
  req: Request<AnnouncementIdParams>,
  _res: Response,
  next: NextFunction,
) => {
  void (async () => {
    try {
      const announcement = await announcementService.findAnnouncementById(Number(req.params.id));

      if (!announcement) {
        return next(createHttpError(404, "Announcement not found"));
      }

      if (announcement.userId !== req.auth.userId) {
        return next(createHttpError(403, "Access denied"));
      }

      next();
    } catch (error) {
      next(error);
    }
  })();
};

export default requireAnnouncementOwner;
