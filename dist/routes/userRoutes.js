import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { getPublishedCreations, getUserCreations, toggleLikedCreations } from "../controllers/userController.js";
const userRouter = express.Router();
userRouter.get('/get-user-creations', isAuthenticated, getUserCreations);
userRouter.get('/get-published-creations', isAuthenticated, getPublishedCreations);
userRouter.post('/toggle-like-creation', isAuthenticated, toggleLikedCreations);
export default userRouter;
