"use client"
import React, { Children, Context, createContext, useContext, useEffect, useMemo, useState } from "react"

import { getSocket } from "../utils/socket"



type ContextType = {
  cash: number,
  lowBalanceCard : boolean
  betValue: number,
  multiplier: string,
  highLow: string,
  diceValue: number,
  rolling: boolean,
  animation : number,
  user : string ,
  setUser : (value : string) =>void ,
  setAnimation : (value : number) => void 
  setRolling: (value: boolean) => void
  setLowBalanceCard: (value: boolean) => void
  setDiceValue: (value: number) => void
  setMultiplier: (value: string) => void
  setHighLow: (option: string) => void
  setBetValue: (amount: number) => void

}
type CashProviderType = {
  children: React.ReactNode
}

const CashContext = createContext<ContextType | undefined>(undefined);

export const useCash = () => {
  const context = useContext(CashContext);
  if (!context) {
    throw new Error("useCash must be used within a CashProvider");
  }
  return context;
};

export const CashProvider = ({ children }: CashProviderType) => {
  const [cash, setCash] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number>(1)
  const [betValue, setBetValue] = useState<number>(0)
  const [multiplier, setMultiplier] = useState<string>("low")
  const [highLow, setHighLow] = useState<string>("High")
  const [rolling, setRolling] = useState(false)
  const [animation , setAnimation] = useState<number>(0)
  const [lowBalanceCard , setLowBalanceCard] = useState<boolean>(false)
  const [user ,setUser] = useState<string>("")



    useEffect(() => {
      try {
        const socket = getSocket()
        if(!socket ){
          console.warn("socket not initalized or no token ")
          return 

        }
        
        socket.on("connect", () => {
          
          console.log("✅ Connected to server:", socket.id);
          socket.emit("getCash")


          socket.on("cash", (data) => {
           
            const balance = data.balance 
            const clientname = data.name
            setUser(clientname)
            // console.log("Received cash:", amount)
            setCash(balance)
          });

          socket.on("updateCash", (amount) => {
            setCash(amount.cash)

          })

        })
        return () => {
          socket.disconnect()
        }
      }
      catch (e) {
        console.log(e);
        
      }
    }, [])

   
  

  const contextValue = useMemo(() => ({
    user, 
    
    cash,
    betValue,
    multiplier,
    highLow,
    diceValue,
    rolling,
    animation,
    lowBalanceCard,
    setUser, 
    setLowBalanceCard,
    setAnimation,
    setRolling,
    setBetValue,
    setMultiplier,
    setHighLow,
    setDiceValue
  }), [cash, diceValue, betValue, multiplier, highLow ]);

  return <CashContext.Provider value={contextValue}>{children}</CashContext.Provider>;

}