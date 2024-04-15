import mongoose from "mongoose";
import post, { IPost } from "./post_model";
import { ObjectId } from "mongoose";
export interface IUser {
    email: string;
    password: string;
    username?: string;
    imgURL?: string;
    _id?: string;
    tokens?: string[];
    posts?:ObjectId[]
    accessToken?:string;
    refreshToken?:string;
   
}

const authSchema = new mongoose.Schema<IUser>({
    email: {
        type: String
        , required: true
    },
    password: {
        type: String
        , required: false
    },
    username: {
        type: String
        , required: false
    },
    imgURL: {
        type: String
        , required: false
    },
    tokens:{
        type: [String]
        , required: false
    }
    , posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
      }],
   
});

export default mongoose.model<IUser>('Auth', authSchema);