import { registry } from "../openapi.ts";
import {
  AnnouncementIdSchema,
  AnnouncementQuerySchema,
  CreateAnnouncementMultipartSchema,
  UpdateAnnouncementMultipartSchema,
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
        "multipart/form-data": {
          schema: CreateAnnouncementMultipartSchema,
        },
      },
    },
  },
  responses: {
    201: { description: "Announcement created" },
    400: { description: "Multiple files or unexpected file field" },
    401: { description: "Authentication required" },
    413: { description: "Image larger than 5 MB" },
    415: { description: "Unsupported media type" },
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
        "multipart/form-data": {
          schema: UpdateAnnouncementMultipartSchema,
        },
      },
    },
  },
  responses: {
    200: { description: "Announcement updated" },
    400: { description: "Invalid parameters, multiple files, or unexpected file field" },
    401: { description: "Authentication required" },
    403: { description: "Access denied" },
    404: { description: "Announcement not found" },
    413: { description: "Image larger than 5 MB" },
    415: { description: "Unsupported media type" },
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
