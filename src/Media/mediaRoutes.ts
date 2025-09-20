import express from "express";
import { Upload } from "../Middlewares/upload";
import { verifyUser } from "../Middlewares/auth";
import { myFiles, QandA, summariseFile, uploadFile } from "./mediaController";

const router = express.Router();

router.post("/upload", Upload.single("file"), verifyUser, uploadFile);
router.get("/summary/:id", verifyUser, summariseFile);
router.post("/qa/:id", verifyUser, QandA);
router.get("/myFiles",verifyUser,myFiles)
export default router;
