import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { generateArticle, generateBlogTitle, removeImageBackground, removeImageObject } from "../controllers/aiController.js";
import { upload } from "../configs/multer.js";

const aiRouter = express.Router();

aiRouter.post('/generate-article', isAuthenticated, generateArticle);
aiRouter.post('/generate-blog-title', isAuthenticated, generateBlogTitle);

aiRouter.post('/remove-image-background', upload.single('image'), isAuthenticated, removeImageBackground);

aiRouter.post('/remove-image-object', upload.single('image'), isAuthenticated, removeImageObject);


export default aiRouter;
