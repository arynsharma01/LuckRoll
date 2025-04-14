import express from "express"
import signupRouter from "./user/signup"
import signinRouter from "./user/signin"


const userRouter = express.Router()

userRouter.use('/signup',signupRouter) 
userRouter.use('/signin',signinRouter) 
 

export default userRouter 