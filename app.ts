import cors from "cors";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import createHttpError from "http-errors";
import multer from "multer";
import swaggerUi from "swagger-ui-express";

import { config } from "./src/config.ts";

import "./src/openapi/announcement.openapi.ts";
import "./src/openapi/auth.openapi.ts";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import logger from "./src/logger.ts";
import { generateOpenApiDocument } from "./src/openapi.ts";
import announcementRoutes from "./src/routes/announcement.routes.ts";
import authRouter from "./src/routes/auth.routes.ts";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || config.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(createHttpError(403, "Origin not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(express.json());

app.use(pinoHttp({ logger }));

const openApiDocument = generateOpenApiDocument();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/auth", authRouter);
app.use("/announcements", announcementRoutes);

// 404 Not Found handler - must be after all routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Error handling middleware
// biome-ignore lint/suspicious/noExplicitAny: Express error middleware receives errors with varying shapes.
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, "Request failed");

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "Uploaded image must be 5 MB or smaller" });
    }

    if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ error: "Only one image can be uploaded in the image field" });
    }
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Validation failed",
      details: {
        body: ["Invalid JSON format in request body"],
      },
    });
  }

  if (err.status && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }

  if (err.code === "P2025") {
    return res.status(404).json({ error: "Resource not found" });
  }

  if (err.code === "P2002") {
    return res.status(409).json({ error: "Unique constraint violation" });
  }

  if (err.code === "P2003") {
    return res.status(400).json({ error: "Foreign key constraint failed" });
  }

  res.status(500).json({ error: "Internal server error" });
});

export default app;
