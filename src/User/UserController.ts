import { db } from "..";
import { apiError, asyncHandler } from "../Utils/handlers";
import { Request,Response } from "express";
const myProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await db.user.findUnique({
        where: {
            id:req.userId,
        },
        select: {
            fullname: true,
            email: true,
            profilePicture: true,
            files:true
        }
    })
    if (!user) {
        throw new apiError(404,"No User Found")
    }
}) 
export {myProfile}