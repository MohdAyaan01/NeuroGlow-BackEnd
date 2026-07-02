import {Request, Response} from "express"
import { Creation } from "../models/creationModel.js";

interface AuthRequest extends Request{
    id?:string
}
export const getUserCreations = async (req:AuthRequest, res:Response):Promise<void> => {
    try {
        const userId = req.id;

        const creations = await Creation.find({ user_id: userId }).sort({ createdAt: -1 });

        res.json({ success: true, creations });
    } catch (error:any) {
        res.json({ success: false, message: error.message });
    }
}

export const getPublishedCreations = async (req:Request, res:Response) => {
    try {
        const creations = await Creation.find({ publish: true }).sort({ createdAt: -1 });

        res.json({ success: true, creations });
    } catch (error:any) {
        res.json({ success: false, message: error.message });
    }
}

export const toggleLikedCreations = async (req:AuthRequest, res:Response):Promise<void> => {
    try {
        const userId = req.id;
        if(!userId){
            res.status(401).json({success:false, message:"Unauthorized"})
            return;
        }
        const { id } = req.body as {id:string};

        const creation = await Creation.findById(id);

        if (!creation) {
            res.status(404).json({ success: false, message: "Creation Not Found !" });
            return;
        }

        const currentLikes:string[] = Array.isArray(creation.likes) ? creation.likes : [];
        const userIdStr = userId.toString();
        let message: string;

        if (currentLikes.includes(userIdStr)) {
            creation.likes = currentLikes.filter((user) => user !== userIdStr);
            message = 'Creation Unliked';
        } else {
            creation.likes.push(userIdStr);
            message = 'Creation Liked';
        }

        await creation.save();

        res.json({ success: true, message });
    } catch (error:any) {
        res.json({ success: false, message: error.message });
    }
}
