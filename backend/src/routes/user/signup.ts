
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { config } from "dotenv";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { date, z } from "zod";
import { Resend } from "resend";
const signupRouter = express.Router()
config()
signupRouter.use(express.json())

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL_ACC
}).$extends(withAccelerate())

const resend = new Resend(process.env.RESEND_API);

const userSchema = z.object({
    email: z.string().email(),
    name: z.string().min(4, "name too small "),
    password: z.string().min(8, "password should be atleast 8 characters "),
    username: z.string().min(4, "username should be atleast 4 characters ")
})
type jwtPayload = {
    name : string , 
    username : string, 
    email : string ,
    password : string
}

const otpSend = async (email : string)  =>  {
    let otp = Math.floor(1000 + Math.random()*4000) 
    
    const { data, error } = await resend.emails.send({
        from: "Luck Roll <luckroll@100xaryan.site>",
        to:email,
        subject: "One-Time Password (OTP) for registering at Luck Roll",
        html: `
  <h1 style="font-family: sans-serif; color: #333;">Your OTP for registering at <strong>Luck Roll</strong> is <span style="color: #007bff;">${otp}</span>.</h1>
  <p style="font-family: sans-serif; color: #555;">This OTP will expire in <strong>15 minutes</strong>.</p>
`

    });

    if (error) {
        console.log(error);
        return otp 
    }
    else {
        console.log(data);

    }
    return otp


}

signupRouter.post('/', async (req: any, res: any) => {
    try {
        const { name, email, password, username } = req.body
        console.log(req.body);

        if (!name || !email || !password || !username) {
            return res.status(400).json({
                message: "missing details "
            })
        }
        const validUserSchema = userSchema.safeParse({
            email: email,
            name: name,
            password: password,
            username: username
        })


        if (!validUserSchema.success) {
            return res.status(402).json({
                message: validUserSchema.error?.errors[0].message
            })
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        })
        if (existingUser) {
            return res.status(409).json({
                message: "email /username already exists  "
            })
        }
        let otp = await otpSend(email)
        const secretKey = process.env.JWT_PASSWORD as string
        const middleToken = jwt.sign({email,password,name,username} ,secretKey)
        
        const now = Date.now()
        const expiresAt = new Date(now + 15 * 60 * 1000)
        const userOtp = await prisma.userOtp.create({
            data :{
                id : middleToken,
                otp : otp,
                deleteAt : expiresAt

            }
        })
        return res.status(200).json({
            message : "ok" ,
            middleToken : userOtp.id,

        })

        

    }
    catch (e) {
        return res.status(400).json({
            message: "some internal error " + e
        })
    }
})


signupRouter.get('/username', async (req: any, res: any) => {
    const user: string = req.query.username || "admin"

    console.log(user);
    const availableUsername = await prisma.user.findFirst({
        where: {
            username: user
        }
    })
    if (!availableUsername) {
        console.log("available");

        return res.status(200).json({
            message: "username is available "
        })
    }
    console.log("not available ");

    return res.status(400).json({
        message: "Username not available"
    })

})

signupRouter.post('/verify/otp', async (req: any, res: any) => {


    try {
    
    const {id,otp} = req.body
    
    const date = new Date()

    await prisma.userOtp.deleteMany({
        where : {
            deleteAt : {
                lt : date
            }
        }
    })
    
    const validOtp = await prisma.userOtp.findFirst({
        where : {
            AND :[
                {id: id },
                {otp : otp },
                {deleteAt : {
                    gt : date
                }}
            ]
    }})
    
    

    if (!validOtp) {
        return res.status(401).json({
            message : "Invalid/expiered OTP  please try again later "
        })
    }
    
    const payload = jwt.decode(id) as jwtPayload
    console.log(payload);

    const {username,email,name,password} = payload 
    
    const createUser = await prisma.user.create({
        data: {
            username: username,
            email: email,
            name: name,
            password: password
        }
    })
    const secretKey = process.env.JWT_PASSWORD as string
    const token = jwt.sign({ email }, secretKey, {
        expiresIn: "7d"
    })
    return res.status(200).json({
        message: "signup successfull",
        token: "Bearer " + token,
        user: createUser.id
    })
    
}
catch(e){
    res.status(400).json({
        message : "Some internal error "
    })
}

    
})

export default signupRouter 
