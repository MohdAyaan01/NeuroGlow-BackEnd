import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface CustomRequest extends Request {
    id?: string;
}

export const isAuthenticated = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "User Not Authenticated...", success: false });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY!) as any;
        if (!decode) {
            return res.status(401).json({ message: "Invalid Token...", success: false });
        }
        req.id = decode.userId;
        next();
    } catch (err: any) {
        console.log("Auth Error:", err.message);
        if (err.name === 'JsonWebTokenError') {
            res.clearCookie('token');
        }
        return res.status(401).json({ message: "Authentication failed...", success: false });
    }
}

export default isAuthenticated;