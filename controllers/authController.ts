import { Request, Response } from "express";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const SignUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "All Fields Are Required", success: false });

        const searchEmail = email.toLowerCase();
        const user = await User.findOne({ email: searchEmail });
        if (user) return res.status(200).json({ message: "If this email is not currently registered, your account has been created. Please log in.", success: true});

        const saltRounds = Number(process.env.SALT || 10);
        const hashPassword = await bcrypt.hash(password, saltRounds);
        await User.create({
            name,
            email,
            password: hashPassword
        })
        return res.status(200).json({ message: "Account Created SuccessFully...", success: true })
    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ message: err.message, success: false });
    }
}
export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All Fields Are Required...",
                success: false,
            });
        }

        const searchEmail = email.toLowerCase();
        const user = await User.findOne({ email: searchEmail });

        if (!user) {
            return res.status(400).json({
                message: "Incorrect Email And Password...",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect Email And Password...",
                success: false,
            });
        }

        const tokenData = {
            userId: user._id,
        };

        const token = jwt.sign(
            tokenData,
            process.env.SECRET_KEY!,
            { expiresIn: "1d" }
        );

        const { password: _, ...userObj } = user.toObject();

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "none",
                secure: true
            })
            .json({
                message: `${user.name} Login Successfully...`,
                success: true,
                user: userObj,
            });

    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ message: err.message, success: false });
    }
};

export const Logout = async (req: Request, res: Response) => {
    console.log("LOGOUT HIT");
    try {
        return res.status(200).cookie("token", "", { maxAge: 0,
            httpOnly: true,
            sameSite: "none",
            secure: true })
            .json({
            message: "Logged Out SuccessFully",
            success: true
        })
    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ message: err.message, success: false });
    }
}