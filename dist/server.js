import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import googleRoutes from './routes/googleRoutes.js';
import paymentRoutes from './routes/razorpayRoutes.js';
const app = express();
const connectApp = async () => {
    try {
        await connectDB();
        await connectCloudinary();
    }
    catch (error) {
        console.log("Error connecting to services: Please Try Again", error);
    }
};
connectApp();
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        const allowedOrigins = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://nueroglow-front-end.onrender.com"
        ];
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not Allowed By Cors...."));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => res.send('Server Is Live Now!...'));
app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleRoutes);
app.use('/api/payment', paymentRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server Is Running', PORT);
});
