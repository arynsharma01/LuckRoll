"use client"
import { useCash } from "../context/CashContext";

interface riskProps {
    value : string
}

export default function Multiplier({value} : riskProps){
   const {multiplier,setMultiplier}=useCash()
       
   
       return (
           <div
               className={`flex p-2 lg:w-24 w-20 h-12 lg:h-16 border-2 rounded-xl justify-center items-center text-md font-bold text-white bg-slate-900 transition duration-200 hover:bg-slate-700 hover:cursor-pointer hover:shadow-2xl hover:shadow-sky-200 
               ${(multiplier=== value  ) ? " border-green-400 bg-slate-700 shadow-md shadow-green-400" : "border-gray-600"}`}
               onClick={() => {
                   setMultiplier(value)
                   
                   console.log(value)
               }}
           >
               {value}
           </div>
       );
}