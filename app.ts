import cors from "cors";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { config } from "./src/config.ts";

import "./src/openapi/announcement.openapi.ts";
import "./src/openapi/auth.openapi.ts";
import { generateOpenApiDocument } from "./src/openapi.ts";
import announcementRoutes from "./src/routes/announcement.routes.ts";
import authRouter from "./src/routes/auth.routes.ts";

const app = express();

app.use(
  cors({
    origin: config.allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
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
  console.error(err);

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}: http://localhost:${PORT}/api-docs`);
});
