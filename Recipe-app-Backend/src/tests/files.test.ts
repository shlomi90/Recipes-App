import request from 'supertest';
import initApp from '../app';
import { Express } from 'express';
import mongoose from 'mongoose';

let app: Express;
beforeAll(async () => {
    app=await initApp();
});

afterAll(async () => {
    await mongoose.connection.close();  
    await mongoose.disconnect();
});

describe ('Files', () => {
    test("upload file" , async () => {
        const filePath = `${__dirname }/cheez.jpg` ;
        console.log(filePath);

        try {
        const response = await request(app)
        .post("/file?file=123.jpg" ).attach('file', filePath)
        expect(response.statusCode ).toEqual(200);
        let url = response.body.url;
        console.log(url);
        url = url.replace(/^.*\/\/[^/]+/, '')
        const res = await request(app).get(url)
        expect(res.statusCode ).toEqual(200);
        } catch (err) {
        console.log(err);
        expect(1).toEqual(2);
        }
    }       
    
    );
});
