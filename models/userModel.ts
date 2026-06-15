import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    plan:{
        type: String,
        enum:['Free','Pro','Enterprise'],
        default:'Free'
    }
}, { timestamps: true })

export const User = mongoose.model("User", userSchema);