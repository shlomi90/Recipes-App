import { Request, Response } from 'express';
import { Model } from 'mongoose';


class BaseController<T> {
    model: Model<T>;
    constructor(model: Model<T>) {
        this.model = model;
    }


    async post (req:Request, res:Response) {
        console.log(req.body);
        try{
             const obj=await this.model.create(req.body);  
            res.send(obj).status(200);
        }catch (err) {
            console.error(err);
            res.status(500).send('Unable to save data to database');
    } 
}

   
async get (req:Request, res:Response){
    try {
        const user = await this.model.findById(req.params.id);
        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Unable to retrieve data from database');
    }
}

async getAll (req:Request, res:Response) {

    try {
        const users = await this.model.find();
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Unable to retrieve data from database');
    }
}


 async put (req:Request, res:Response){
    try {
        const id=req.params.id;
        const obj=req.body;
        await this.model.findByIdAndUpdate(id,obj);
        res.status(200).send('Data updated in database');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Unable to update data in database');
    }
}

async delete (req:Request, res:Response){
    const id=req.params.id;
    try {
        await this.model.findByIdAndDelete(id);
        res.status(200).send('Data deleted');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Unable to delete user from database');
    }
}



}   

const createController = <T>(model:Model<T>) => new BaseController<T>(model);
export default createController;
export {BaseController};