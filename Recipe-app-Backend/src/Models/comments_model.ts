import mongoose from "mongoose";
import post, { IPost } from "./post_model";
import { ObjectId } from "mongoose";

export interface IComment {
    content: string;
    author: string;
    post_id: string;
    createdAt?: Date;
    author_id?: string;
}

const commentSchema = new mongoose.Schema<IComment>({
    content: {
        type: String
        , required: true
    },
    author: {
        type: String
        , required: true
    },
    post_id: {
        type: String,
        ref: 'Post',
    },
    createdAt: {
        type: Date
        , default: Date.now,
    },
    author_id: {
        type: String
        , required: false
    },
    
});

export default mongoose.model<IComment>('Comment', commentSchema);