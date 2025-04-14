import { PrismaClient } from "@prisma/client";
import { Socket } from "socket.io";
import { getBalance, setBalance, updateBalance } from "../utils/balanceStore";


function profitCalculater(betValue : number , multiplier : string): number{
    if (multiplier == "low") {
        return betValue * 1.2 ;
    }
    else if(multiplier == "medium"){
        return betValue *1.7 
    }
    else{
        return betValue *2.3
    }
}

export default async function placeBet(socket :Socket , email : string , prisma : PrismaClient ,multiplier : string , selected : string , betValue : number ){
    const balance = getBalance(email)
    if (balance < betValue) {
        socket.emit("insufficient_balance", "low balance please add money ")
        return 
    }
    await prisma.user.update({
        where :{
            email : email
        },
        data :{
            balance : {decrement :betValue}
        }
    })
    setBalance(email,balance-betValue)

    const dice = [1,2,3,4,5,6,7,8,9,10,11,12]
    let weights :number[] = [] ; 
    if (selected == "low" ) {
        switch (multiplier) {
            case "low":
                weights = [25,25,20,20,15,15,10,10,5,5,3,2]
                break;
            case "medium" :
                weights = [18,18,14,14,10,10,8,8,12,12,8,8]
                break ; 

            case "high" :
                weights = [10,10,8,8,5,5,15,15,20,20,25,25]
                break ; 
            default:
                break;
        }
    }
    else {
        switch (multiplier) {
            case "low":
                weights = [2,3,5,5,10,10,15,15,20,20,25,25]
                break;

            case "medium" :
                weights = [8,8,12,12,8,8,10,10,14,14,18,18]

                break ; 
            
            case "high" :
                weights = [25,25,20,20,15,15,5,5,8,8,10,10] 
                break ;

            default:
                break;
        }
    }
    let totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    let totalSum = 0 
    let win:number = -1  ; 

    for (let i = 0; i < weights.length; i++) {
        totalSum += weights[i];
        if (totalSum >= random ) {
            win = i + 1 ;
            break; 
        }
    }
    // console.log("win = " + win + "totalsum "+  totalSum + "random = " + random) ;
    console.log(selected + " " ) ;
    
    if (win < 6 && selected =="low") {

        const profit = profitCalculater(betValue,multiplier) 
        try{
        const updatedData = await prisma.user.update({
            where :{
                email : email
            },
            data :{
                balance :{increment:profit}
            }
        })
        setBalance(email, updatedData.balance)
        socket.emit("result", {
            result : "user wins ",
            win : win ,
            code : "200" 
            
        })
        socket.emit("updateCash",{
            cash : getBalance(email)
        })
        return
    }
    catch(error){
        socket.emit("error",error)
        return
    }
        
       
    }
    else if(win > 6 && selected=="high"){
        const profit = profitCalculater(betValue,multiplier) 
        try {
        
        const updatedData = await prisma.user.update({
            where :{
                email : email
            },
            data :{
                balance :{increment:profit}
            }
        })
        setBalance(email , updatedData.balance)
        socket.emit("result", {
            result : "user wins ",
            win : win ,
            code : "200" 
            
        })
        socket.emit("updateCash",{
            cash : getBalance(email)
        })
        return
    }
    catch(error){
        socket.emit("error",error)
        return
    }
    }

    else{
        socket.emit("result", {
            result : "user lost  ",
            win : win ,
            code : "400" 
            
        })
        socket.emit("updateCash",{
            cash : getBalance(email)
        })

        return
    }

} 