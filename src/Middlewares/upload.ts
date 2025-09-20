import multer from "multer";
import cloudinary from 'cloudinary'

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


const storage = multer.memoryStorage();
 
export const Upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
      "image/tiff",
    ];
      
      if (allowedFileTypes.includes(file.mimetype)) {
          cb(null,true)
      }
      else {
          cb(new Error("File Type Not Allowed"))
      }
  },
});




export const storeFile = async(file : Express.Multer.File)=> {
  const b64 = Buffer.from(file.buffer).toString('base64')
  const dataUri = `data:${file.mimetype};base64,${b64}`
try {
  
  const cloudinaryRes = await cloudinary.v2.uploader.upload(dataUri, {
      resource_type:"raw",
      folder:"DOCUMENT-SCAN-AI"
    })
    return cloudinaryRes.secure_url;
} catch (error) {
  throw new Error("Cloud Storage Upload Failed")
}
}

