import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors, { CorsOptionsDelegate, CorsRequest } from "cors";
import { PrismaClient } from "@prisma/client";
import mediaRoutes from "./Media/mediaRoutes";
import authRoutes from "./User/userRoute";
import passport from "passport";

import "./User/passport";
import morgan from "morgan";
import { logger } from "./Logger";
dotenv.config();

const app = express();
const Port = process.env.PORT || 5000;
const corsOptionDelegate: CorsOptionsDelegate = (
  req: CorsRequest,
  callback
) => {
  const allowedOrigin = [
    "http://localhost:5173",
    "https://document-scan-ai-frontend.vercel.app",
  ];
  const origin = req.headers.origin;
  if (!origin || allowedOrigin.includes(origin)) {
    callback(null, {
      origin: true,
      credentials: true,
    });
  } else {
    callback(new Error("Not Allowed By Cors"), {
      origin: false,
    });
  }
};
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptionDelegate));
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);
app.get("/", (req, res) => {
  res.send("This Is An AI Project");
});
app.use("/file", mediaRoutes);
app.use("/auth", authRoutes);
export const db = new PrismaClient();
app.listen(Port, () => {
  console.log(`Your Sever is running on http://localhost:${Port}`);
});
