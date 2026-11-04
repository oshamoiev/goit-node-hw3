import prisma from "../../prisma/client.ts";
import type {
  AnnouncementQuery,
  CreateAnnouncementBody,
  UpdateAnnouncementBody,
} from "../validators/announcement.validator.ts";

const PAGE_SIZE = 10;

const includeUser = {
  user: { select: { id: true, username: true, email: true, name: true } },
};

const toAnnouncement = <T extends { price: unknown }>(announcement: T) => ({
  ...announcement,
  price: Number(announcement.price),
});

export const getAnnouncements = async (query: AnnouncementQuery) => {
  const { search, sort, page } = query;

  const where = search ? { title: { contains: search, mode: "insensitive" as const } } : {};

  const [data, total] = await Promise.all([
    prisma.announcement.findMany({
      where,
      orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: includeUser,
    }),
    prisma.announcement.count({ where }),
  ]);

  return {
    data: data.map(toAnnouncement),
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / PAGE_SIZE),
      perPage: PAGE_SIZE,
    },
  };
};

export const getAnnouncementById = async (id: number) => {
  const announcement = await prisma.announcement.findUnique({
    where: { id },
    include: includeUser,
  });

  return announcement ? toAnnouncement(announcement) : null;
};

export const findAnnouncementById = async (id: number) => {
  return prisma.announcement.findUnique({
    where: { id },
  });
};

export const createAnnouncement = async (
  userId: number,
  data: CreateAnnouncementBody & { imageUrl?: string },
) => {
  const announcement = await prisma.announcement.create({
    data: { ...data, userId },
    include: includeUser,
  });

  return toAnnouncement(announcement);
};

export const updateAnnouncement = async (
  id: number,
  data: UpdateAnnouncementBody & { imageUrl?: string },
) => {
  const announcement = await prisma.announcement.update({
    where: { id },
    data,
    include: includeUser,
  });

  return toAnnouncement(announcement);
};

export const deleteAnnouncement = async (id: number) => {
  await prisma.announcement.delete({
    where: { id },
  });
};
