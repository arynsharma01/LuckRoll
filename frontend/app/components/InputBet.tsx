"use client"
import { useState } from "react"
import { useCash } from "../context/CashContext"
import { LowCashCard } from "./LowCashCard"

export default function InputBet(){
    const {setBetValue ,cash ,betValue ,lowBalanceCard,setLowBalanceCard} = useCash()
    
    return <div>
        <div className="pb-5">
        {(lowBalanceCard)?<div className="gap-3"><LowCashCard/></div> : ""}
        </div>
        <div className="flex flex-col ">
           
            <div className="text-xl text-white py-2">
                Bet Amount 

            </div>

        
        <input onChange={(e)=>{
            const value = Number(e.target.value)
            setBetValue(value)
        
            if (value > cash) {
              setLowBalanceCard(true)
            } else {
              setLowBalanceCard(false)
            }
        }}
         type="number" className={`flex p-2 lg:min-w-24  lg:h-16 border-2 rounded-xl justify-center items-center text-md font-bold text-white bg-slate-900 hover:bg-slate-700 transition duration-200 hover:cursor-pointer hover:shadow-2xl hover:shadow-sky-200
         ${(cash<betValue)?"border-red-500":""}
         `}/>
        </div>
    </div>
}