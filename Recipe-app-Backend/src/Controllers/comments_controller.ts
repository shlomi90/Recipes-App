import { BaseController } from "./Base_Controller";
import { IComment } from "../Models/comments_model";
import Comment from "../Models/comments_model";
import Auth from "../Models/user_model";
import { IRequest } from "../Common/auth_middleware";
import { Response } from "express";
import Post from "../Models/post_model";

class Commentcontroller extends BaseController<IComment>{
    constructor() {
        super(Comment);
    }

    async post (req: IRequest, res: Response) {
        try {

          const postid=req.params.postId;
          const userid=req.body.user.id;
          const uesrname=await this.findUserNameById(userid);
             const comment = new Comment({
              content: (req.body as { content: string }).content, 
              author: uesrname,
              post_id: postid,
              createdAt: Date.now(),
              author_id: userid
          });
            await comment.save();
            await Post.findByIdAndUpdate(postid, {
              $push: { comments: comment._id },
              $inc: { numOfComments: 1 } // Increment comment count
            }, { new: true });;
            res.status(201).send(comment);
          } catch (error) {
            console.log(error.message)
            res.status(400).send(error.message);
          }
    }

    
  
async get(req: IRequest, res: Response) {
      try{
      const postid=req.params.postId;
      const comments = await Comment.find({post_id:postid});
      res.status(200).send(comments);
      }catch(error){
        console.log(error.message)
        res.status(400).send(error.message);
      }
    }  

async delete(req: IRequest, res: Response) {
  try{
    const commentid=req.params.commentId;
    const postid=req.params.postId;
    const com= await Comment.findById(commentid);
   if(com. author_id==req.body.user.id){
    await Comment.findByIdAndDelete(commentid);
    await Post.findByIdAndUpdate(postid, {
      $pull: { comments: commentid },
      $inc: { numOfComments: -1 }
    }, { new: true });
    res.status(200).send("comment deleted");
  }else{
    res.status(400).send("you are not the author of this comment");
  }
}catch(error){
  console.log(error.message)
  res.status(400).send(error.message);
  }
}

async findUserNameById(id: string) {
  try{
    const user_id=id;
    const user = await Auth.findById(user_id);
    return user.username;
  }
  catch(error){
    console.log(error.message)
    return error.message;
  }
}
  
  }

export default new Commentcontroller();