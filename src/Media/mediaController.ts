import { apiError, apiResponse, asyncHandler } from "../Utils/handlers";
import { Request, Response } from "express";
import fs from "fs";
import pdf from "pdf-parse";
import { convertPDFToImages, extractTextFromImage } from "../Utils/tesseract";
import { db } from "..";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { text } from "stream/consumers";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});

const uploadFile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      throw new apiError(404, "Invalid Request");
    }

    const pdfData = await pdf(req.file.buffer);
    let extractedText = pdfData.text;

    const tempPath = path.join(__dirname, `temp_${Date.now()}.pdf`);
    fs.writeFileSync(tempPath, req.file.buffer);
    if (!extractedText) {
      const images = await convertPDFToImages(tempPath);
      extractedText = "";
      for (const img of images) {
        const text = await extractTextFromImage(img);
        extractedText += text + "\n";
      }
    }
    fs.unlinkSync(tempPath);
    const saveFileInDb = await db.file.create({
      data: {
        fileName: req.file.originalname as string,
        url: "xyz" as string,
        userId: req.userId,
        extractedText,
      },
    });
    if (!saveFileInDb) {
      throw new apiError(400, "CouldNot Save File Details");
    }
    res
      .status(200)
      .json(new apiResponse(200, "File Analysis Successfull", saveFileInDb));
  }
);

const summariseFile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const fileId = req.params.id;
    const checkFile = await db.file.findUnique({
      where: {
        id: fileId,
      },
    });
    if (!checkFile) {
      throw new apiError(404, "No File Found");
    }
    const user = await db.user.findUnique({
      where: {
        id: req.userId,
      },
    });
    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `summarise this in points also and in paragraph too and greetings with the name of the user his/her name is ${user?.fullname}  only greet with first name use simple and easy to understand words ${checkFile.extractedText} `,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: `please summarise this with key points and user convinents simple style`,
            },
          ],
        },
      ],
    });
    const summary = response.text || "No Summary Generated";

    res.status(200).json(new apiResponse(200, "Summary Generated", summary));
  }
);

const QandA = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { question } = req.body;
    const fileId = req.params.id;
    const checkFile = await db.file.findUnique({
      where: {
        id: fileId,
      },
    });
    if (!checkFile) {
      throw new apiError(404, "No Files Found");
    }
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `anser this ${question} for this texts ${checkFile.extractedText} i want the answer to be proper within from this texts i have provided and if external is added give me the proper source from where it is added  `,
            },
          ],
        },
      ],
    });
        const answer = response.text
        res.status(200).json(new apiResponse(200,"Question Answered Successfully",answer))
  }
);

const myFiles = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const files = await db.file.findMany({
        where: {
            userId:req.userId
        }
    })
    if (!files) {
        throw new apiError(404,"No Files Found")
    }
    res.status(200).json(new apiResponse(200,"Files Fetched",files))
})
export { uploadFile, summariseFile,QandA ,myFiles};
