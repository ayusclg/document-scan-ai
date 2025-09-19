import express from "express";
import { Upload } from "../Middlewares/upload";
import { verifyUser } from "../Middlewares/auth";
import { QandA, summariseFile, uploadFile } from "./mediaController";

const router = express.Router();

router.post("/upload", Upload.single("file"), verifyUser, uploadFile);
router.get("/summary/:id", verifyUser, summariseFile);
router.get("/q&a/:id", verifyUser, QandA);
export default router;
