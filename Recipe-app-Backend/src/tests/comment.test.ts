// comments_controller.test.js
import  CommentController  from "../Controllers/comments_controller";
import  Post from "../Models/post_model";
import mongoose from "mongoose";
import request from 'supertest';
import initApp from '../app';
import { Express } from 'express';
import auth, { IUser } from '../Models/user_model';
import { IPost } from '../Models/post_model';
import Coment from "../Models/comments_model";
import { access } from "fs";

const user:IUser = {
    email:"test@comment.com",
     password:"123456789",
        username:"testcomment",
        imgURL:"https://www.google.com",
   };
   const user2:IUser = {
    email:"test@commentcreate.com",
     password:"123456789",
    username:"testcomment2",
    imgURL:"https://www.google.com",
   };

   const user3:IUser = {
    email:"test@commentcreate3.com",
     password:"123456789",
    username:"testcomment3",
    imgURL:"https://www.google.com",
   };


    const post:IPost = {
        title: "title",
        message: "message",
        owner: "123123123",
        image: "image",
    }
    
    let app: Express;
let token='';
beforeAll(async () => {
    app=await initApp();
    await Post.deleteMany();
    await auth.deleteMany({'email':user.email});
    await auth.deleteMany({'email':user2.email});
    await Coment.deleteMany(); 

     const b=await request (app).post("/auth/register").send(user);
     console.log(b.body);
    const response2 = await request(app).post("/auth/login").send({email:user.email,password:user.password});
    token = response2.body['access token:']
    const s= await request(app).post("/post").send(post).set('Authorization', "JWT " + token);
    await request(app).get("/auth/logout").set ("Authorization", "JWT " + token);

    const response4=await request(app).post("/auth/register").send(user2);
    user._id=response4.body._id;
    const response3 = await request(app).post("/auth/login").send({email:user2.email,password:user2.password});
    token = response3.body['access token:']


});

afterAll(async () => {
    await mongoose.connection.close();  
    await mongoose.disconnect();
});

describe("POST /comment", () => {
    test ("should create a comment", async () => {
        const postId = (await Post.findOne())._id.toString();
        const commentData = { content: "This is a test comment" };
        const response = await request(app).post(`/post/${postId}/comments`).send(commentData)
        .set("Authorization", "JWT " + token);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("content", commentData.content);
        const updatedPost = await Post.findById(postId);
        expect(updatedPost.comments[0].toString()).toBe(response.body._id);
       
    });

    test("get all comments", async () => {
        const postId = (await Post.findOne())._id.toString();
        const response = await request(app).get(`/post/${postId}/comments`).set("Authorization", "JWT " + token);
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toHaveProperty("content", "This is a test comment");
        
    });
    test("create another comment", async () => {
        const postId = (await Post.findOne())._id.toString();
        const commentData = { content: "This is another test comment" };
        const response = await request(app).post(`/post/${postId}/comments`).send(commentData)
        .set("Authorization", "JWT " + token);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("content", commentData.content);
        const updatedPost = await Post.findById(postId);
        expect(updatedPost.comments[1].toString()).toBe(response.body._id);
       
    }
    );

    test("delete comment", async () => {
        const postId = (await Post.findOne())._id.toString();
        const commentId = (await Coment.findOne())._id.toString();
        const response = await request(app).delete(`/post/${postId}/comments/${commentId}`).set("Authorization", "JWT " + token);
        expect(response.status).toBe(200);
        expect(response.text).toBe("comment deleted");
    });

    test("should return 400 if comment not found", async () => {
        const postId = (await Post.findOne())._id.toString();
        const commentId = '1323';
        const response = await request(app).delete(`/post/${postId}/comments/${commentId}`).set("Authorization", "JWT " + token);   
        expect(response.status).toBe(400);
    }
    );

    test("unauthorized user should not delete comment", async () => {
        const postId = (await Post.findOne())._id.toString();
        const commentId = (await Coment.findOne())._id.toString();
        await request(app).get("/auth/logout").set ("Authorization", "JWT " + token);
        const r= await request (app).post("/auth/register").send(user3);
        const response2 = await request(app).post("/auth/login").send({email:user3.email,password:user3.password});
        token = response2.body['access token:']
        const response3 = await request(app).delete(`/post/${postId}/comments/${commentId}`).set("Authorization", "JWT " + token);
        expect(response3.status).toBe(400);
        expect(response3.text).toBe("you are not the author of this comment");
    }

    );
});








