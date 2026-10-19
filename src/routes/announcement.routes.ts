import { Router } from "express";
import * as announcementsController from "../controllers/announcement.controller.ts";
import authMiddleware from "../middleware/auth.middleware.ts";
import * as validator from "../middleware/validate.ts";
import {
  AnnouncementIdSchema,
  AnnouncementQuerySchema,
  CreateAnnouncementSchema,
  UpdateAnnouncementSchema,
} from "../validators/announcement.validator.ts";

const router = Router();

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
  validator.validateBody(CreateAnnouncementSchema),
  announcementsController.createAnnouncement,
);
router.patch(
  "/:id",
  authMiddleware,
  validator.validateParams(AnnouncementIdSchema),
  validator.validateBody(UpdateAnnouncementSchema),
  announcementsController.updateAnnouncement,
);
router.delete(
  "/:id",
  authMiddleware,
  validator.validateParams(AnnouncementIdSchema),
  announcementsController.deleteAnnouncement,
);

export default router;
