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
    price: z.number().positive(),
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
    id: z.string().regex(/^\d{1,9}$/, "id must be an integer"),
  }),
);

export type CreateAnnouncementBody = z.infer<typeof CreateAnnouncementSchema>;
export type UpdateAnnouncementBody = z.infer<typeof UpdateAnnouncementSchema>;
export type AnnouncementQuery = z.infer<typeof AnnouncementQuerySchema>;
export type AnnouncementIdParams = z.infer<typeof AnnouncementIdSchema>;

registry.registerPath({
  method: "get",
  path: "/api/announcements",
  tags: ["Announcements"],
  summary: "List announcements with pagination, search and sorting",
  request: { query: AnnouncementQuerySchema },
  responses: {
    200: { description: "Announcements with pagination" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/announcements/{id}",
  tags: ["Announcements"],
  summary: "Get a single announcement by id",
  request: { params: AnnouncementIdSchema },
  responses: {
    200: { description: "Announcement with author data" },
    404: { description: "Announcement not found" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/announcements",
  tags: ["Announcements"],
  summary: "Create an announcement",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": { schema: CreateAnnouncementSchema },
      },
    },
  },
  responses: {
    201: { description: "Announcement created" },
    401: { description: "Authentication required" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "patch",
  path: "/api/announcements/{id}",
  tags: ["Announcements"],
  summary: "Partially update own announcement",
  security: [{ bearerAuth: [] }],
  request: {
    params: AnnouncementIdSchema,
    body: {
      content: {
        "application/json": { schema: UpdateAnnouncementSchema },
      },
    },
  },
  responses: {
    200: { description: "Announcement updated" },
    401: { description: "Authentication required" },
    403: { description: "Access denied" },
    404: { description: "Announcement not found" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/api/announcements/{id}",
  tags: ["Announcements"],
  summary: "Delete own announcement",
  security: [{ bearerAuth: [] }],
  request: { params: AnnouncementIdSchema },
  responses: {
    204: { description: "Announcement deleted" },
    401: { description: "Authentication required" },
    403: { description: "Access denied" },
    404: { description: "Announcement not found" },
  },
});
