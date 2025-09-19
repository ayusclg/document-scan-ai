import { NextFunction, Request, Response } from "express";
import { apiError } from "../Utils/handlers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { db } from "..";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : req.cookies.accessToken;
    if (!token) {
      throw new apiError(401, "No Token Found");
    }

    const decode = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    const user = await db.user.findUnique({
      where: {
        id: decode.id,
      },
    });
    if (!user) {
      throw new apiError(403, "UnAuthorized User");
    }
    req.userId = user.id.toString();
    next();
  } catch (error) {
    console.log(error);
    throw new apiError(401, "Please Login");
  }
};
