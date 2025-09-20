import { db } from "..";
import { apiError, apiResponse, asyncHandler } from "../Utils/handlers";
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
    res.status(200).json(new apiResponse(200,"Profile Data ",user))
}) 
export {myProfile}