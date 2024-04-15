import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import Post, { IPost } from '../Models/post_model';
import auth, { IUser } from '../Models/user_model';

const user:IUser = {
     email:"test@post.com",
      password:"123456789",
      username:"testpost",
      imgURL:"test"
    

    };
const differentUser: IUser = {
    email: "different@email.com",
    password: "password",
    username: "different",
    imgURL: "different"
  };

let app: Express;
let token: string;
beforeAll(async () => {
    app=await initApp();
    await Post.deleteMany();
    await auth.deleteMany({'email':user.email});
    await auth.deleteMany({'email':differentUser.email});
    const response=await request(app).post("/auth/register").send(user);
    user._id=response.body.username;
    const response2 = await request(app).post("/auth/login").send(user);
    token = response2.body['access token:']
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
});

const post:IPost = {
    title: "title",
    message: "message",
    image: "image",
    
   
}

const post2:IPost = {
    title: "title2",
    message: "message2",
    image: "image",
    
   
}
const updatedPost = {
    title: "updated title",
    message: "updated message",
    image: "image",
  };

describe("POST /post", () => {
    test("should create a post", async () => {
        const response =  await request(app).post("/post").send(post).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(post.title);
        expect(response.body.owner).toBe(user._id);
        expect(response.body.message).toBe(post.message);
    });
    test("should return an array with 1 post", async () => {
        const response = await request(app).get('/post').set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const post = response.body[0];
        expect(post.title).toBe(post.title);
        expect(post.message).toBe(post.message);
        expect(post.owner).toBe(post.owner);
    });
    test ("should create a second post", async () => {
        const response = await request(app).post("/post").send(post2).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(post2.title);
        expect(response.body.owner).toBe(user._id);
        expect(response.body.message).toBe(post2.message);
    });
    test("Try to create a post with missing data", async () => {
        const response = await request(app).post("/post").send({ title: "test post" }).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe("Unable to save data to database");
    });
    test("Try to create a post with empty data", async () => {
        const response = await request(app).post("/post").send({}).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe("Unable to save data to database");
    });
    test("should update a post", async () => {
        const response = await request(app).post("/post").send(post).set('Authorization', "JWT " + token);
        const postId = response.body._id;
        const response2 = await request(app).put(`/post/${postId}`).send(updatedPost).set('Authorization', "JWT " + token);
    
        expect(response2.statusCode).toBe(200);
        expect(response2.body.title).toBe(updatedPost.title);
        expect(response2.body.message).toBe(updatedPost.message);
        expect(response2.body.owner).toBe(user._id);
      });

      test("should return a 404 error if the post is not found", async () => {
        const response = await request(app).put(`/post/12345`).send(post).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe("Error updating post");
      });

      test("should return a 403 error if the user is not authorized to update the post", async () => {
        const response = await request(app).post("/post").send(post).set('Authorization', "JWT " + token);
        const postId = response.body._id;
        const response2 = await request(app).post("/auth/register").send(differentUser);
        differentUser._id = response2.body._id;
        const differentToken = (await request(app).post("/auth/login").send(differentUser)).body['access token:'];
        const response3 = await request(app).put(`/post/${postId}`).send(updatedPost).set('Authorization', "JWT " + differentToken);
    
        expect(response3.statusCode).toBe(403);
        expect(response3.text).toBe('Unauthorized to update this post');
      });

      test("should return the user's posts", async () => {
        const response = await request(app).get(`/post/${user._id}`).set
        ('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(4);
      });

      test("should delete a post", async () => {
        const response = await request(app).post("/post").send(post).set('Authorization', "JWT " + token);
        const postId = response.body._id;
        const response2 = await request(app).delete(`/post/${postId}`).set('Authorization', "JWT " + token);
        expect(response2.statusCode).toBe(200);
        
      });

      test("should return a 404 error if the post is not found", async () => {
        const response = await request(app).delete(`/post/12345`).set('Authorization', "JWT " + token);
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe("Error deleting post");
      });

      test("should return a 403 error if the user is not authorized to delete the post", async () => {
        const response = await request(app).post("/post").send(post).set('Authorization', "JWT " + token);
        const postId = response.body._id;
        const response2 = await request(app).post("/auth/register").send(differentUser);
        differentUser._id = response2.body._id;
        const differentToken = (await request(app).post("/auth/login").send(differentUser)).body['access token:'];
        const response3 = await request(app).delete(`/post/${postId}`).set('Authorization', "JWT " + differentToken);
        expect(response3.statusCode).toBe(403);
        expect(response3.text).toBe('Unauthorized to delete this post');
      }
      );
      
   
}
);


