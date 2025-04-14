
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { config } from "dotenv";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
const signinRouter = express.Router()
config()
signinRouter.use(express.json())
const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_ACC
}).$extends(withAccelerate())

const userSchema =  z.object({
    email : z.string().email(), 
})


signinRouter.post('/', async (req: any, res: any) => {
    try{
    const {  email, password } = req.body
    if ( !email || !password) {
        return res.status(400).json({
            message: "missing details "
        })
    }
    
    const validUserSchema = userSchema.safeParse({
        email : email,
    })
    
    
    if (!validUserSchema.success) {
        
        return res.status(404).json({
            message : "invalid email "
        })
    }
    
    const existingUser = await prisma.user.findFirst({
        where : {
            
            AND :{
                email : email,
                password : password 
            }
        }
    })
    if(!existingUser){
        return  res.status(409).json({
            message : "email does not exists / wrong password  "
        })
    }
   
    const secretKey = process.env.JWT_PASSWORD as string 
    const token = jwt.sign({email} ,secretKey, {
        expiresIn : "7d"
    }  )
    return  res.status(200).json({
        message : "signin successfull",
        token : "Bearer " + token,
        user : existingUser.id
    })
}
catch(e){
    return res.status(400).json({
        message : "some internal error " + e 
    })
}
})

export default signinRouter 
