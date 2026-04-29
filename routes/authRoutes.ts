import express from "express";
import { Login, Logout, SignUp } from "../controllers/authController.js";

const router = express.Router();
import rateLimit from "express-rate-limit";

// Create a rule: Maximum 5 login attempts per 15 minutes
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, 
    message: { message: "Too many login attempts from this IP, please try again after 15 minutes", success: false }
});
router.route("/signup").post(SignUp);
router.route("/login").post(loginLimiter,Login);
router.route("/logout").get(Logout);
export default router;