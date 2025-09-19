import { User } from "./interfaces";
import jwt from "jsonwebtoken";

export const generateAccessToken = async (user: User) => {
  const accessSecret = process.env.ACCESS_TOKEN_SECRET as string;
  if (!accessSecret) {
    throw new Error("accessToken Generation Failed");
  }
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      authOId: user.authOId,
    },
    accessSecret,
    {
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRY) || "1hr",
    }
  );
};

export const generateRefreshToken = async (user: User) => {
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET!;
  if (!refreshSecret) {
    throw new Error("refreshToken Generation Failed");
  }

  return jwt.sign(
    {
      id: user.id,
      authOId: user.authOId,
    },
    refreshSecret,
    {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRY) || "30d",
    }
  );
};
