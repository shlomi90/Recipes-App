import createController, { BaseController } from "./Base_Controller";
import Post from '../Models/post_model'
import { IPost } from "../Models/post_model";
import { IRequest } from "../Common/auth_middleware";
import { Response } from "express";
import Auth from "../Models/user_model";
import { ObjectId } from "mongoose";

class Postcontroller extends BaseController<IPost>{
    constructor() {
        super(Post);
    }

    async post (req: IRequest, res: Response) {
      const id = req.body.user?.id;
      const post = req.body as IPost;
      const imgURL = req.body.image;
    
     try{
      const user = await Auth.findById(id);
      if (!user) {
        res.status(404).send('User not found');
        return;
      }
     
      post.owner=user.username;
      post.createdAt=new Date();
      post.image=imgURL;
      
      const createdPost = await this.model.create(post);
          await Auth.findByIdAndUpdate(id,
    { $push: { posts: createdPost._id } },
    { new: true }
  );

  res.send(createdPost).status(200);
} catch (err) {
  console.log(err);
  res.status(500).send("Unable to save data to database");
}
    }


async put(req: IRequest, res: Response) {
  const id = req.params.id;
  const updatedPost = req.body as IPost;
  try { 
    const post = await this.model.findByIdAndUpdate(
      id,
      { $set: updatedPost }, 
      { new: true } 
    );
    const user=await Auth.findById(req.body.user?.id);
 
    if (post.owner !== user.username) {
      res.status(403).send('Unauthorized to update this post');
      return;
    }
    res.send(post).status(200);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error updating post');
  }
}

async delete(req: IRequest, res: Response) {
  const id = req.params.id;
  try {
    const post = await this.model.findById(id);
    const user=await Auth.findById(req.body.user?.id);
    if (post.owner !== user.username) {
      res.status(403).send('Unauthorized to delete this post');
      return;
    }
    await this.model.findByIdAndDelete(id);
    res.send(post).status(200);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error deleting post');
  }
}

//function to get all posts by a userid
async getPostsByUserId(req: IRequest, res: Response) {
  const id = req.body.user?.id;
  try {
    const user = await Auth.findById(id);
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    const posts = await this.model.find({ owner: user.username });
    res.send(posts).status(200);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error retrieving posts');
  }
}

} 

export default new Postcontroller();