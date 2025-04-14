import { PrismaClient } from "@prisma/client";
import { Socket } from "socket.io";
import { setBalance } from "../utils/balanceStore";

type ExtendedPrismaClient = ReturnType<PrismaClient["$extends"]>;

export default async function getCash(socket : Socket ,email :string, prisma :PrismaClient){
    try{
        
    let user = await prisma.user.findFirst({
        where: {
            email : email
        }
    })
    const balance = user?.balance || 0
    const name = user?.name
    setBalance(email, balance )
    socket.emit("cash",{
        name : name ,
        balance : balance
    })
}
    catch(error){
        console.log(error);
        
        socket.emit("error" , error)

    }
    
}