import mongoose, { Types } from "mongoose";
// import Comment, { IComment } from "./comments_model";


export interface IPost {
    title: string;
    message: string;
    image?: string;
    owner?: string;
    _id?: string;
    createdAt?: Date;
    comments?: Types.ObjectId[];
    numOfComments?: number;
    
    
    
}   

const postSchema = new mongoose.Schema<IPost>({
    title: {
        type: String
        , required: true
    },
    message: {
        type: String
        , required: true
    },
    image: {
        type: String,
        required: false
    },
   owner: { 
       type:String
       ,required:true
    }
    , createdAt: {
        type: Date
        , default: Date.now
    }
    , comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }]
    ,numOfComments: {
        type: Number
        , default: 0
    }
    , 
});

export default mongoose.model<IPost>('Post', postSchema);