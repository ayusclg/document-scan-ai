import express from "express";
import { Upload } from "../Middlewares/upload"; 
import { verifyUser } from "../Middlewares/auth";
import { summariseFile, uploadFile } from "./mediaController";

const router = express.Router();

router.post("/upload", Upload.single("file"),verifyUser , uploadFile);
router.get("/summary/:id",verifyUser,summariseFile)
export default router;
    