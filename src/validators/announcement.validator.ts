import { z } from "zod";
import { registry } from "../openapi.ts";

export const AnnouncementCategorySchema = registry.register(
  "AnnouncementCategory",
  z.enum(["sale", "service", "job", "other"]),
);

export const CreateAnnouncementSchema = registry.register(
  "CreateAnnouncement",
  z.object({
    title: z.string().min(5).max(50),
    description: z.string().min(10),
    price: z.number().min(0.01),
    category: AnnouncementCategorySchema,
  }),
);

export const UpdateAnnouncementSchema = registry.register(
  "UpdateAnnouncement",
  CreateAnnouncementSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided",
  ),
);

export const AnnouncementQuerySchema = registry.register(
  "AnnouncementQuery",
  z.object({
    search: z.string().optional(),
    sort: z.enum(["newest", "oldest"]).default("newest"),
    page: z.coerce.number().int().min(1).default(1),
  }),
);

export const AnnouncementIdSchema = registry.register(
  "AnnouncementId",
  z.object({
    id: z.string().regex(/^[1-9]\d{0,8}$/, "id must be a positive integer"),
  }),
);

export type CreateAnnouncementBody = z.infer<typeof CreateAnnouncementSchema>;
export type UpdateAnnouncementBody = z.infer<typeof UpdateAnnouncementSchema>;
export type AnnouncementQuery = z.infer<typeof AnnouncementQuerySchema>;
export type AnnouncementIdParams = z.infer<typeof AnnouncementIdSchema>;
