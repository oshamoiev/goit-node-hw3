import type { Request, Response } from "express";
import createHttpError from "http-errors";
import * as announcementService from "../services/announcement.service.ts";
import { uploadImage } from "../services/cloudinary.service.ts";
import type {
  AnnouncementIdParams,
  AnnouncementQuery,
  CreateAnnouncementBody,
  UpdateAnnouncementBody,
} from "../validators/announcement.validator.ts";

export const getAllAnnouncements = async (
  _req: Request,
  res: Response<unknown, { query: AnnouncementQuery }>,
) => {
  const { data, pagination } = await announcementService.getAnnouncements(res.locals.query);

  res.status(200).json({ data, pagination });
};

export const getAnnouncement = async (
  req: Request<AnnouncementIdParams, unknown, unknown>,
  res: Response,
) => {
  const id = Number(req.params.id);
  const announcement = await announcementService.getAnnouncementById(id);

  if (!announcement) {
    throw createHttpError(404, "Announcement not found");
  }

  res.status(200).json(announcement);
};

export const createAnnouncement = async (
  req: Request<Record<string, string>, unknown, CreateAnnouncementBody>,
  res: Response,
) => {
  let imageUrl: string | undefined;

  if (req.file) {
    try {
      const uploadedImage = await uploadImage(req.file.path);
      imageUrl = uploadedImage.secure_url;
      req.log.info({ userId: req.auth.userId }, "Announcement image uploaded");
    } catch (error) {
      req.log.error({ err: error, userId: req.auth.userId }, "Announcement image upload failed");
      throw error;
    }
  }

  const announcement = await announcementService.createAnnouncement(req.auth.userId, {
    ...req.body,
    ...(imageUrl && { imageUrl }),
  });

  req.log.info(
    { announcementId: announcement.id, userId: req.auth.userId },
    "Announcement created",
  );

  res.status(201).json(announcement);
};

export const updateAnnouncement = async (
  req: Request<AnnouncementIdParams, unknown, UpdateAnnouncementBody>,
  res: Response,
) => {
  const id = Number(req.params.id);

  if (!req.file && Object.keys(req.body).length === 0) {
    throw createHttpError(422, "At least one field or image must be provided");
  }

  let imageUrl: string | undefined;

  if (req.file) {
    try {
      const uploadedImage = await uploadImage(req.file.path);
      imageUrl = uploadedImage.secure_url;
      req.log.info({ announcementId: id, userId: req.auth.userId }, "Announcement image uploaded");
    } catch (error) {
      req.log.error(
        { err: error, announcementId: id, userId: req.auth.userId },
        "Announcement image upload failed",
      );
      throw error;
    }
  }

  const announcement = await announcementService.updateAnnouncement(id, {
    ...req.body,
    ...(imageUrl && { imageUrl }),
  });

  req.log.info({ announcementId: id, userId: req.auth.userId }, "Announcement updated");

  res.status(200).json(announcement);
};

export const deleteAnnouncement = async (
  req: Request<AnnouncementIdParams, unknown, unknown>,
  res: Response,
) => {
  const id = Number(req.params.id);
  await announcementService.deleteAnnouncement(id);

  req.log.info({ announcementId: id, userId: req.auth.userId }, "Announcement deleted");

  res.status(204).end();
};
