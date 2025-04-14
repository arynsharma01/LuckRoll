import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import { PrismaClient } from '@prisma/client'
import jwt from "jsonwebtoken"
import { withAccelerate } from '@prisma/extension-accelerate'
import { config, configDotenv } from "dotenv"
import getCash from "./socket/cash"

import userRouter from "./routes"
import placeBet from "./socket/bet"

const basePrisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL_ACC
})

const prisma = basePrisma.$extends(withAccelerate()) as unknown  as PrismaClient

config()
const app = express();
app.use(cors());


app.use('/luckroll/v1/user',userRouter)

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

interface jwtPayload {
  email: string
}




let useremail :string ;

io.use((socket, next) => {

  const token = socket.handshake.auth.token
  

  if (!token) {
    console.log("mo token ");

    return next(new Error("no token was found "))

  }
  try {
    const jwtPassword = process.env.JWT_PASSWORD || ""

    let value = token.split(" ")
    if(value[0] != "Bearer"){
      throw new Error("invalid token format ")
    }
    const auth = value[1]
    const decoded = jwt.verify(auth, jwtPassword) as jwtPayload
    useremail = decoded.email
    if (!decoded) {
      return next(new Error("invalid token  "))
    }
    const existingUser = prisma.user.findFirst({
      where: {
        email: decoded.email
      }
    })
    if (!existingUser) {
      return next(new Error("user does not exist "))
    }

    console.log("in the middleware");

    next()
  }
  catch (e) {
    next(new Error("some unknown error "))
  }

})

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("getCash", () => {
    getCash(socket,useremail,prisma)

  });

  socket.on("bet", (data) => {
    const multiplier :string = data.multiplier
    const selected :string = data.selected
    const betValue :number = data.betValue
    console.log("inside bet ");
    
    
    placeBet(socket,useremail,prisma,multiplier,selected,betValue)
    
    
  })

  socket.on("message", (data) => {
    console.log(data);

    socket.emit("coins", { "coins": 20 })

  })

  



  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("🚀 Socket.IO server running on port 3001");
});
