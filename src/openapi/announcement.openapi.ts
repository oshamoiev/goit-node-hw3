import { registry } from "../openapi.ts";
import {
  AnnouncementIdSchema,
  AnnouncementQuerySchema,
  CreateAnnouncementSchema,
  UpdateAnnouncementSchema,
} from "../validators/announcement.validator.ts";

registry.registerPath({
  method: "get",
  path: "/announcements",
  tags: ["Announcements"],
  summary: "List announcements with pagination, search and sorting",
  request: { query: AnnouncementQuerySchema },
  responses: {
    200: { description: "Announcements with pagination" },
    400: { description: "Invalid query parameters" },
  },
});

registry.registerPath({
  method: "get",
  path: "/announcements/{id}",
  tags: ["Announcements"],
  summary: "Get a single announcement by id",
  request: { params: AnnouncementIdSchema },
  responses: {
    200: { description: "Announcement with author data" },
    400: { description: "Invalid parameters" },
    404: { description: "Announcement not found" },
  },
});

registry.registerPath({
  method: "post",
  path: "/announcements",
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
  path: "/announcements/{id}",
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
    400: { description: "Invalid parameters" },
    422: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/announcements/{id}",
  tags: ["Announcements"],
  summary: "Delete own announcement",
  security: [{ bearerAuth: [] }],
  request: { params: AnnouncementIdSchema },
  responses: {
    204: { description: "Announcement deleted" },
    400: { description: "Invalid parameters" },
    401: { description: "Authentication required" },
    403: { description: "Access denied" },
    404: { description: "Announcement not found" },
  },
});
