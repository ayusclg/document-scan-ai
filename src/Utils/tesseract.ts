import Tesseract from "tesseract.js";
import { fromPath } from "pdf2pic";
import fs from "fs";
import pdf from "pdf-parse";

export const extractTextFromImage = async (imagePath: any) => {
  const {
    data: { text },
  } = await Tesseract.recognize(imagePath, "eng", {
    logger: (m) => console.log(m),
  });
  return text;
};

export const convertPDFToImages = async (pdfPath: any) => {
  const storeAsImage = fromPath(pdfPath, {
    density: 300,
    format: "png",
    width: 1200,
    height: 1600,
  });

  const pdfBuffer = fs.readFileSync(pdfPath);

  const data = await pdf(pdfBuffer);
  const numPages = data.numpages;

  const images = [];
  for (let i = 1; i <= numPages; i++) {
    const result = await storeAsImage(i);
    images.push(result.path);
  }

  return images;
};
