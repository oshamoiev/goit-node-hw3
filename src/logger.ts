import pino from "pino";
import { config } from "./config.ts";

const isDev = config.nodeEnv !== "production";

const logger = pino({
  level: isDev ? "debug" : "info",
  ...(isDev && {
    transport: {
      target: "pino-pretty",
    },
  }),
});

export default logger;
