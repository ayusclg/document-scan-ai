import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../Utils/token";
import { apiError } from "../Utils/handlers";
import { User } from "@prisma/client";

export const googleCallback = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as User;
    if (!user) {
      throw new apiError(401, "Please Login");
    }
    const refreshToken = await generateRefreshToken(user);
    const accessToken = await generateAccessToken(user);

 
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "none",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });

      res.redirect(
        `https://document-scan-ai-frontend.vercel.app/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
  } catch (error) { 
    throw new apiError(400,"Error In Google Callback")
  }
  
};
