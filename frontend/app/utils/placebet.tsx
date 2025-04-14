

import { Socket } from "socket.io-client"
import { useCash } from "../context/CashContext"
import { getSocket } from "./socket"

type promiseData=  {
  win : number ,
  code : number
}

export const placeBet = (betValue:Number, highLow : string , multiplier : string): Promise<promiseData | null> => {
    return new Promise((resolve, reject) => {
      const socket: Socket | null = getSocket()
      if (!socket) return resolve(null)
  
      socket.emit("bet", {
        betValue: betValue,
        multiplier: multiplier,
        selected: highLow.toLowerCase(),
      })
  
      socket.once("result", (data) => {
        
        console.log(data);
        
        const winData = {win : data.win ,
          code : data.code
        }
        resolve(winData)
        
      })
  
      socket.once("insufficient_balance", (data) => {
        console.log("insufficient balance")

        

        resolve(null)
      })
  
      socket.once("error", (data) => {
        console.log(data)
        reject(data)
      })
    })
  }