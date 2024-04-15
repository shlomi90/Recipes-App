import { Request, Response } from 'express';
import auth_model, { IUser } from '../Models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/user_model';
import { IRequest } from '../Common/auth_middleware';
import Auth from '../Models/user_model';
import { OAuth2Client } from 'google-auth-library';
import { log } from 'console';

const client=new OAuth2Client();
const googleSignIn = async (req: Request, res: Response) => {
    
    console.log (req.body.credentialResponse.credential)
    console.log (req.body.credentialResponse.clientId)
    try{
    const ticket = await client.verifyIdToken({
        idToken: req.body.credentialResponse.credential,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    if(email!=null){
        let user= await Auth.findOne({email:email });
        if(user==null){
            user= await auth_model.create({
                email:email,
                password:"sign in with google",
                username:payload?.name,
                imgURL:payload?.picture});
        }
        const accessToken=  jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
        const refreshToken= jwt.sign({id:user._id},process.env.JWT_REFRESH);
        if(user.tokens==null)
        user.tokens=[refreshToken];
        else
        user.tokens.push(refreshToken);
        await user.save();
        console.log("access token: "+accessToken);
        console.log("refresh token: "+refreshToken);
        console.log(user.tokens[0]); // Accessing the access token from user.tokens
        console.log(user.tokens[1]); // Accessing the refresh token from user.tokens
            return res.status(200).send({
                "message": "success",
                'access token:': accessToken,
                'refresh token:': refreshToken,
                'user id:': user._id,
                'username:': user.username,
                'imgURL:': user.imgURL,
                'email:': user.email,
                'posts': user.posts,
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).send("error");
    }
}
    

const login = async (req: Request, res: Response) => {
    console.log("login");
    const email = req.body.email;
    const password = req.body.password;
    if (email==null || password==null) {
        return res.status(400).send("email or password not provided");
}
    try{
        const user= await auth_model.findOne({email:email});
        if(user==null){
           return res.status(400).send("email not found");
        }
        const match=await bcrypt.compare(password,user.password);
    if(!match){
        return res.status(400).send("wrong password");
    }
    const accessToken=  jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
    const refreshToken= jwt.sign({id:user._id},process.env.JWT_REFRESH);

    if(user.tokens==null)
    user.tokens=[refreshToken];
    else
    user.tokens.push(refreshToken);
    await user.save();
    console.log("access token: "+accessToken);
    console.log("refresh token: "+refreshToken);
    return res.status(200).send
    ({'access token:':accessToken,
    'refresh token:':refreshToken,
    'user id:':user._id,
    'username:':user.username,
    'imgURL:':user.imgURL,
    'email:':user.email,
    'posts':user.posts,
});
}   catch(err){
        return res.status(400).send("error");
}}


const register = async (req: Request, res: Response) => {
    console.log("register");
    const email = req.body.email;
    const password = req.body.password;
    const userName = req.body.username;
    const imgURL = req.body.imgURL;
    console.log(imgURL);
    if (!email || !password||!userName||!imgURL) {
         return res.status(400).send("one of the fields is missing");
    }
    try{
        const exist= await auth_model.findOne({email:email});
        if(exist!=null){
           return res.status(400).send("email already exist");
        }
}   catch(err){
     return res.status(400).send("error");
} 
try{
    const userexist= await auth_model.findOne({username:userName});
    if(userexist!=null){
       return res.status(400).send("username already exist");
    }
}   catch(err){
    return res.status(400).send("error");
    }
try{
    const salt=await bcrypt.genSalt(10);
    const hash=await bcrypt.hash(password,salt);
    const auth= await auth_model.create({email:email,password:hash,username:userName,imgURL:imgURL});
    res.status(200).send(auth);
} catch(err){
    res.status(400).send("error");
}}

const refresh = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token==null) return res.sendStatus(401);
     jwt.verify(token,process.env.JWT_REFRESH,async (err:any,user:any)=>{
        if(err) return res.sendStatus(403).send(err.message);
        const user_id=user.id;
        try{
            user = await User.findById(user_id);
            if(user==null) return res.sendStatus(404).send("user not found");
            if(!user.tokens.includes(token))
            {
                user.tokens=[];
                await user.save();
                return res.sendStatus(403).send("token not found");
            }
            const accessToken=  jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE});
            const refreshToken= jwt.sign({id:user._id},process.env.JWT_REFRESH);

            user.tokens[user.tokens.indexOf(token)]=refreshToken;
            await user.save();
            return res.status(200).send
            ({'access token:':accessToken,
            'refresh token:':refreshToken});
        }
        catch(err){
            return res.status(400).send("error");
        }
     });

     
}

const logout = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token==null) return res.sendStatus(401);
     jwt.verify(token,process.env.JWT_REFRESH,async (err:any,user:any)=>{
        if(err) return res.sendStatus(403)
        const user_id=user.id;
        try{
            user = await User.findById(user_id);
            if(user==null) return res.sendStatus(404).send("user not found");
            if(!user.tokens.includes(token))
            {
                user.tokens=[];
                await user.save();
                return res.sendStatus(403).send("token not found");
            }
            user.tokens.splice(user.tokens.indexOf(token),1);
            await user.save();
            return res.sendStatus(200);
        }
        catch(err){
            return res.status(400).send("error");
        }
     });
}

const updateUserdetails = async (req: IRequest, res: Response) => {
    const id=req.params.id;
    const updatname = req.body.username;
    const updateimgURL = req.body.imgURL;
    const updateemail = req.body.email;
    try{
       const user= await Auth.findById(id);
       if(!user){
         return res.status(404).send('User not found');
       }
       user.username=updatname;
         user.imgURL=updateimgURL;
            user.email=updateemail;
        await user.save();
        res.status(200).send('User updated successfully');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error updating user');
    }
    
}


export default { login, logout, register, refresh,updateUserdetails,googleSignIn};