
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { config } from "dotenv";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
const signupRouter = express.Router()
config()
signupRouter.use(express.json())
const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_ACC
}).$extends(withAccelerate())


const userSchema =  z.object({
    email : z.string().email(),
    name : z.string().min(4,"name too small "),
    password : z.string().min(8,"password should be atleast 8 characters "),
    username : z.string().min(4,"username should be atleast 4 characters ")
})

signupRouter.post('/', async (req: any, res: any) => {
    try{
    const { name, email, password ,username } = req.body
    console.log(req.body);
    
    if (!name || !email || !password || !username) {
        return res.status(400).json({
            message: "missing details "
        })
    }
    const validUserSchema  = userSchema.safeParse({
        email : email ,
        name : name ,
        password : password ,
        username : username 
    })
    
    
    if (!validUserSchema.success) {
        return res.status(402).json({
            message : validUserSchema.error?.errors[0].message
        })
    }
    const existingUser = await prisma.user.findFirst({
        where : {
            OR :[
               { email :email},
                {username : username}
            ]
        }
    })
    if(existingUser){
        return  res.status(409).json({
            message : "email /username already exists  "
        })
    }
    
    const createUser = await prisma.user.create({
        data : {
            username : username ,
            email : email,
            name : name ,
            password : password 
        }
    })
    const secretKey = process.env.JWT_PASSWORD as string 
    const token = jwt.sign({email} ,secretKey, {
        expiresIn : "7d"
    }  )
    return   res.status(200).json({
        message : "signup successfull",
        token : "Bearer " + token,
        user : createUser.id
    })
}
catch(e){
    return res.status(400).json({
        message : "some internal error " + e 
    })
}
})


signupRouter.get('/username' , async (req: any , res: any)=>{
    const user :string = req.query.username || "admin"
    
    console.log(user);
    const availableUsername = await prisma.user.findFirst({
        where :{
            username : user
        }
    })
    if (!availableUsername) {
        console.log("available");
        
        return res.status(200).json({
            message : "username is available "
        })
    }
    console.log("not available ");
    
    return res.status(400).json({
        message : "Username not available"
    })
    
})

export default signupRouter 
