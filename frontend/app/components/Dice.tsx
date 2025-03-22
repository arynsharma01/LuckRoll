"use client";
import { color, motion } from "framer-motion";
import { useCash } from "../context/CashContext";
import { useEffect, useState } from "react";

// bg-[#F1C800]


export default function Dice() {
    const colors = [
        
        "bg-lime-400",   
        "bg-emerald-500",
        "bg-cyan-500",   
        "bg-blue-500",   
        "bg-yellow-500", 
        "bg-orange-500", 
        "bg-rose-400",   
        "bg-indigo-500", 
        "bg-purple-500",
        "bg-pink-500"    
      ];
      
      
    
    const [col, setCol] = useState("bg-[#F1C800]")
    const { diceValue,rolling ,setRolling } = useCash()
    const [key, setKey] = useState<number>(0)

    
    useEffect(() => {
        setKey((prev) => prev + 1)
        rollDice()
    }, [diceValue])

    const rollDice = () => {
        
        let interval = setInterval(() => {
            setCol(colors[Math.floor(Math.random() * colors.length)])
        }, 100)

        
        setTimeout(() => {
            clearInterval(interval)
            setRolling(false)
            setKey((prev) => prev + 1)
        }, 1200)
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <motion.div

                className={`flex rounded-2xl items-center p-14 lg:p-32 border-2 border-white font-bold text-7xl text-white ${col}`}
                key={key}
                animate={rolling ? { rotate: [0, 360], scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1.2, ease: "easeInOut"  }}
            >
                {diceValue}
            </motion.div>

            
        </div>
    );
}
