import { Response } from "express";
import { CustomRequest } from "../middleware/auth.js";
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Creation } from "../models/creationModel.js";
import { v2 as cloudinary } from "cloudinary";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
export const generateArticle = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.id;
        const { prompt, length } = req.body;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are a world-class, professional SEO copywriter. You write highly engaging, comprehensive, and perfectly structured articles. You must format your entire response using Markdown (using #, ##, ### for headings, bullet points, and bold text). NEVER include conversational filler like 'Here is your article'. Just output the raw article."
        });

        const result = await model.generateContent(prompt);
        const content = result.response.text();

        await Creation.create({
            user_id: userId,
            prompt,
            content,
            type: 'article'
        });

        res.json({
            success: true,
            message: "Article generated successfully",
            content: content,
        });

    } catch (error: any) {
        console.error("AI Generation Error:", error);

        let errorMessage = "Failed to generate article. ";
        if (error.code === 'ECONNREFUSED') {
            errorMessage += "Is Ollama running locally?";
        } else {
            errorMessage += error.message;
        }

        res.status(500).json({ success: false, message: errorMessage })
    }
}

export const generateBlogTitle = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.id;
        const { prompt } = req.body;
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: "You are an expert digital marketing copywriter. Your only job is to output exactly 5 highly engaging, compelling, and click-worthy blog titles. Do NOT include any conversational filler text or acknowledge the prompt. ONLY output the numbered list of 5 titles."
        });

        const result = await model.generateContent(prompt);
        const content = result.response.text()?.trim();

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Ai Returned Empty Blog title"
            })
        }

        await Creation.create({
            user_id: userId,
            prompt,
            content,
            type: 'blog-title'
        });

        res.json({ success: true, message: "Blog Generated Successfully...", content: content })

    } catch (error: any) {
        console.error("Blog Title Error:", error);

        let errorMessage = "Failed to generate blog title. ";
        if (error.code === 'ECONNREFUSED') {
            errorMessage += "Is Ollama running locally?";
        } else {
            errorMessage += error.message;
        }

        res.status(500).json({ success: false, message: errorMessage })
    }
}

export const removeImageBackground = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.id;
        const image = req.file;

        if (!image) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                }
            ]
        })


        import("fs").then(fs => fs.unlinkSync(image.path)).catch(console.error);

        await Creation.create({
            user_id: userId,
            prompt: 'Remove background from image',
            content: secure_url,
            type: 'image'
        });

        res.json({
            success: true,
            content: secure_url,
            message: "Remove Background SuccessFully..."
        });

    } catch (error: any) {
        console.log(error.message)

        res.status(500).json({ success: false, message: error.message })
    }
}

export const removeImageObject = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.id;
        const { object } = req.body;
        const image = req.file;

        if (!image) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [{ effect: `gen_remove:prompt_${object}` }]
        });

        import("fs").then(fs => fs.unlinkSync(image.path)).catch(console.error);

        await Creation.create({
            user_id: userId,
            prompt: `Remove ${object} from image`,
            content: secure_url,
            type: 'image'
        });

        res.json({
            success: true,
            content: secure_url,
            message: "Remove Object Successfully..."
        })

    } catch (error: any) {
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message })
    }
}
