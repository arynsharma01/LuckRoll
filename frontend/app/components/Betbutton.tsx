"use client"

import { useCash } from "../context/CashContext"
import { Howl } from "howler"
export default function BetButton(){
    const {diceValue,setDiceValue ,setRolling} = useCash()
    const coinAudio = new Howl({
        src : ['/dicesound.mp3']
    })
    return <div>
        <div className="flex mt-8 p-2 lg:min-w-24  lg:h-16 border rounded-xl justify-center items-center text-lg  font-semibold  bg-[#1FFF20] hover:bg-green-500 hover:cursor-pointer hover:shadow-2xl hover:shadow-green-500 "
        onClick={()=>{
            
            setDiceValue(diceValue+1)
            setRolling(true)
            coinAudio.play()
        }}>
            Bet 
        </div>
    </div>
}