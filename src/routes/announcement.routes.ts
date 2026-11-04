import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import createHttpError from "http-errors";
import * as announcementsController from "../controllers/announcement.controller.ts";
import requireAnnouncementOwner from "../middleware/announcement-owner.ts";
import authMiddleware from "../middleware/auth.middleware.ts";
import cleanupUpload from "../middleware/cleanup-upload.ts";
import upload from "../middleware/upload.ts";
import * as validator from "../middleware/validate.ts";
import {
  AnnouncementIdSchema,
  AnnouncementQuerySchema,
  CreateAnnouncementSchema,
  UpdateAnnouncementSchema,
} from "../validators/announcement.validator.ts";

const router = Router();

const requireMultipartFormData = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.is("multipart/form-data")) {
    return next(createHttpError(415, "Content-Type must be multipart/form-data"));
  }

  next();
};

router.get(
  "/",
  validator.validateQuery(AnnouncementQuerySchema),
  announcementsController.getAllAnnouncements,
);
router.get(
  "/:id",
  validator.validateParams(AnnouncementIdSchema),
  announcementsController.getAnnouncement,
);
router.post(
  "/",
  authMiddleware,
  requireMultipartFormData,
  upload.single("image"),
  cleanupUpload,
  validator.validateBody(CreateAnnouncementSchema),
  announcementsController.createAnnouncement,
);
router.patch(
  "/:id",
  authMiddleware,
  validator.validateParams(AnnouncementIdSchema),
  requireAnnouncementOwner,
  requireMultipartFormData,
  upload.single("image"),
  cleanupUpload,
  validator.validateBody(UpdateAnnouncementSchema),
  announcementsController.updateAnnouncement,
);
router.delete(
  "/:id",
  authMiddleware,
  validator.validateParams(AnnouncementIdSchema),
  requireAnnouncementOwner,
  announcementsController.deleteAnnouncement,
);

export default router;
