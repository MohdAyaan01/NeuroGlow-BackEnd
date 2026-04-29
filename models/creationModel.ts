import mongoose from "mongoose";

const creationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['article', 'blog-title', 'image'],
        required: true
    },
    publish: {
        type: Boolean,
        default: false
    },
    likes: {
        type: [String],
        default: []
    }
}, { timestamps: true });

export const Creation = mongoose.model("Creation", creationSchema);
