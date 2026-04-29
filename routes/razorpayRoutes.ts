import express, { Router } from "express";
import { CreateOrder, verifyPayment } from "../controllers/razorpayController.js";

const router = express.Router();

router.post("/create-order",CreateOrder);
router.post("/verify-payment",verifyPayment);

export default router;

