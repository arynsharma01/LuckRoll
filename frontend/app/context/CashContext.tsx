"use client"
import React, { Children, Context, createContext, useContext, useEffect, useMemo, useState } from "react"
import { io,Socket } from "socket.io-client"


type ContextType = {
    cash : number,
    betValue: number,
    multiplier : string,
    highLow : string,
    diceValue : number,
    rolling : boolean ,
    setRolling : (value : boolean )=> void 
    setDiceValue : (value :number) => void 
    setMultiplier : (value : string)=>void
    setHighLow : (option : string)=>void 
    setBetValue : (amount : number)=>void

}
type CashProviderType = {
    children : React.ReactNode
}

const CashContext = createContext<ContextType | undefined>(undefined);

export const useCash = () => {
    const context = useContext(CashContext);
    if (!context) {
        throw new Error("useCash must be used within a CashProvider");
    }
    return context;
};

export const CashProvider = ({children} : CashProviderType )=>{
    const [cash,setCash]  = useState<number>(0);
    const [diceValue , setDiceValue] =  useState<number>(1) 
    const [betValue, setBetValue] = useState<number>(0)
    const [multiplier, setMultiplier] = useState<string>("low")
    const [highLow, setHighLow] = useState<string>("")
    const [rolling, setRolling] = useState(false)
    useEffect(()=>{
        const socket: Socket = io("http://localhost:3001");
    socket.on("connect", () => {
    
        console.log("✅ Connected to server:", socket.id);
        socket.emit("getCash");

      
      socket.on("cash", (amount: number) => {
        console.log("Received cash:", amount)
        setCash(amount)
      });

      socket.on("updateCash" ,(amount : number )=>{
        setCash(amount)

      })
          
      });
      return () => {
        socket.disconnect();
      };
    },[])
       const contextValue = useMemo(() => ({
        cash,
        betValue,
        multiplier,
        highLow,
        diceValue ,
        rolling ,
        setRolling,
        setBetValue,
        setMultiplier,
        setHighLow,
        setDiceValue
    }), [cash,diceValue, betValue, multiplier, highLow]);

    return <CashContext.Provider value={contextValue }>{children}</CashContext.Provider>;
    
}