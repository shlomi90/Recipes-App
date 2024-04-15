import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import { Express } from 'express';
import users from '../Models/user_model';

const user = {
    email: "testauth@gmail.com",
    password: "123456789",
    username: "testauth",
    imgURL:"https://www.google.com",
};

const user2 = {
    email: "changeemail",
    username: "changeusername",
    imgURL:"changeimgURL",
};

const user3 = {
    email: "test3",
    password: "123456789",
    username: "test3",
    imgURL:"https://www.google.com",
}


let accesstoken: '';
let refreshtoken: '';

let app: Express;
beforeAll(async () => {
    app=await initApp();
    await users.deleteMany({'email':user.email});

});

afterAll(async () => {
    await users.deleteMany({'email':user.email});
    await mongoose.connection.close();
    await mongoose.disconnect();

});

describe('Auth tests', () => {
    test('Register test', async () => {
        const response = await request(app).post('/auth/register').send(user);
        expect(response.status).toBe(200);
    })  
    test ('Try to register without auth', async () => {
        const response = await request(app).post('/post').send(user);
        expect(response.status).not.toEqual(200);
    })
       
    
    test('Login test', async () => {
        const response = await request(app).post('/auth/login').send(user);
        expect(response.status).toBe(200);
        accesstoken = response.body['access token:'];
        expect(accesstoken).not.toBeNull();
        refreshtoken = response.body['refresh token:'];
        expect(refreshtoken).not.toBeNull();
        const response2 = await request(app).get('/post').set('Authorization', "JWT " + accesstoken);
        expect(response2.status).toBe(200);
        const response3 = await request(app).get('/post').set('Authorization', "JWT 1 " + accesstoken);
        expect(response3.status).toBe(403);
    
    })

    test('update user test', async () => {
        
        const response = await request(app).post('/auth/login').send(user);
        expect(response.status).toBe(200);
        const user_id = response.body['user id:'];
        const response2 = await request(app).put(`/auth/${user_id}`).send(user);
        expect(response2.status).toBe(200);
        })
    })

 test('Refresh token test', async () => {
        const response = await request(app).get('/auth/refresh').set ('Authorization', "JWT " + refreshtoken);
        expect(response.status).toBe(200);
      const newaccesstoken = response.body['access token:'];
      const newrefreshtoken = response.body['refresh token:'];
        expect(newaccesstoken).not.toBeNull();
        expect(newrefreshtoken).not.toBeNull();

    })

    // jest.setTimeout(30000);
    // test('timeout test', async () => {
    //     await new Promise(resolve => setTimeout(resolve, 20000));
    //     const response = (await request(app).get('/post').set('Authorization', "JWT " + accesstoken));
    //     expect(response.status).not.toEqual(200);
    // })

    test('Logout test', async () => {
       const response= await request(app).get('/auth/logout').set('Authorization', "JWT " + refreshtoken);
         expect(response.status).toBe(200);
});




