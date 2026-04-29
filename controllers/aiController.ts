import { Response } from "express";
import { CustomRequest } from "../middleware/auth.js";
import ollama from "ollama";
import { Creation } from "../models/creationModel.js";
import { v2 as cloudinary } from "cloudinary";

export const generateArticle = async (req: CustomRequest, res: Response) => {
    try {
        const userId = req.id;
        const { prompt, length } = req.body;

        const response = await ollama.chat({
            model: "tinyllama", // Try installing and changing this to "llama3" if possible!
            messages: [
                {
                    role: "system",
                    content: `You are a world-class, professional SEO copywriter. You write highly engaging, comprehensive, and perfectly structured articles. You must format your entire response using Markdown (using #, ##, ### for headings, bullet points, and bold text). NEVER include conversational filler like 'Here is your article'. Just output the raw article.`
                },
                {
                    role: "user",
                    content: prompt,
                }
            ],
            options: {
                temperature: 0.7,
                num_predict: length || 2000,
            }
        });


        const content = response.message.content;

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

        const response = await ollama.chat({
            model: "tinyllama", // Try changing this to "llama3" if possible!
            messages: [
                {
                    role: "system",
                    content: `You are an expert digital marketing copywriter. Your only job is to output exactly 5 highly engaging, compelling, and click-worthy blog titles. Do NOT include any conversational filler text or acknowledge the prompt. ONLY output the numbered list of 5 titles.`
                },
                {
                    role: "user",
                    content: prompt,
                }
            ],
            options: {
                temperature: 0.8, // Slightly higher creativity for titles
                num_predict: 700,
            }
        });

        const content = response.message.content?.trim();

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
        
        // CRITICAL FIX: Delete the temporary file from your server so it doesn't run out of storage!
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
        // Note: added status(500) so the frontend toast actually shows an error!
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

        // WAIT for the AI generation to finish before grabbing the text!
        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [{ effect: `gen_remove:prompt_${object}` }]
        });
        
        // CRITICAL FIX: Delete the temporary file from your server
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
