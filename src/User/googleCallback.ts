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
      secure: false,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
    });
    res.redirect(
      `http://localhost:5173/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  } catch (error) {}
};
