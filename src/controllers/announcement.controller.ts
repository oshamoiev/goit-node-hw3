import type { Request, Response } from "express";
import createHttpError from "http-errors";
import * as announcementService from "../services/announcement.service.ts";
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
  const announcement = await announcementService.createAnnouncement(req.auth.userId, req.body);

  res.status(201).json(announcement);
};

export const updateAnnouncement = async (
  req: Request<AnnouncementIdParams, unknown, UpdateAnnouncementBody>,
  res: Response,
) => {
  const id = Number(req.params.id);
  await checkOwnership(id, req.auth.userId);

  const announcement = await announcementService.updateAnnouncement(id, req.body);

  res.status(200).json(announcement);
};

export const deleteAnnouncement = async (
  req: Request<AnnouncementIdParams, unknown, unknown>,
  res: Response,
) => {
  const id = Number(req.params.id);
  await checkOwnership(id, req.auth.userId);

  await announcementService.deleteAnnouncement(id);

  res.status(204).end();
};

const checkOwnership = async (id: number, userId: number) => {
  const announcement = await announcementService.findAnnouncementById(id);

  if (!announcement) {
    throw createHttpError(404, "Announcement not found");
  }

  if (announcement.userId !== userId) {
    throw createHttpError(403, "Access denied");
  }
};
