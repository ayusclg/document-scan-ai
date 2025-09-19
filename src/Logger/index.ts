import path from "path";
import { createLogger, format, transports } from "winston";

const logDir = path.join(__dirname, "../../logs");

export const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "HH:mm:ss" }),
    format.colorize(),
    format.errors({ stack: true }),
    format.printf(({ timestamp, stack, level, message }) => {
      return stack
        ? `${timestamp} ${level}:${message} - stack: ${stack}`
        : `${timestamp} ${level}:${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      level: "error",
      filename: path.join(logDir, "error.log"),
      maxFiles: 3,
      maxsize: 5 * 1034 * 1024,
      tailable: true,
    }),
    new transports.File({
      level: "debug",
      filename: path.join(logDir, "combined.log"),
      maxFiles: 3,
      maxsize: 10 * 1024 * 1024,
      tailable: true,
    }),
  ],
  exitOnError: false,
});
