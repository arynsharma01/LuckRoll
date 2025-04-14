"use client"

import { useEffect, useMemo, useState } from "react"
import { useCash } from "../context/CashContext"
import { Howl } from "howler"
import { placeBet } from "../utils/placebet"
import { useRouter } from "next/navigation"


export default function BetButton(){
    
    const {diceValue,setDiceValue ,setRolling , betValue,highLow,multiplier ,setAnimation,animation ,lowBalanceCard } = useCash()
    const [click,setClick] = useState(false)

    const coinAudio = useMemo(() => new Howl({ src: ["/dicesound.mp3"] }), [])

    useEffect(()=>{
        let time = setTimeout(()=>{
            setClick(false)
        },3000)
        return () => clearTimeout(time)
    },[click])

    const router = useRouter()
    

    return <div>
        <div  className={`flex ${(click || lowBalanceCard)? "pointer-events-none cursor-not-allowed opacity-50 " :"cursor-pointer" } mt-4 p-2  lg:min-w-24  lg:h-16 border rounded-xl justify-center items-center text-lg  font-semibold  bg-[#1FFF20] hover:bg-green-500   hover:shadow-2xl hover:shadow-green-500 ${(betValue<=0)?"pointer-events-none cursor-not-allowed bg-green-800":"cursor-pointer"} `}
        
        onClick={async ()=>{
            
            if (!localStorage.getItem("Authorization")) {
                router.push('/signup') 
                return
                
            }
            
            setRolling(true)
            setClick(true)
            coinAudio.play()
            const data = await placeBet(betValue,highLow,multiplier)
            
            
            if (data?.code == 200) {
                setAnimation(animation*2+2)
            }
            else{
               
                
                setAnimation(animation*2+1 )
            }
            setDiceValue(data?.win || diceValue)
        }}>
            Bet 
        </div>
    </div>
}