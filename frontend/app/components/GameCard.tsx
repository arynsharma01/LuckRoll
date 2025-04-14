"use client"

import { useRouter } from "next/navigation"

export default function GameCard(){
    const router = useRouter()
    return <div>
        <div className=" hover:shadow-2xl hover:shadow-sky-200 hover:bg-black border-white border-2 rounded-md max-w-[35vh] lg:min-h-64  transition-transform duration-300 transform hover:scale-105 hover:cursor-pointer  text-center flex flex-col items-center justify-center  "
        onClick={()=>{
            router.push('/games/luckroll')
        }}>
            <img className=" rounded-md w-full" src="/DiceBet.png" alt="game" />
            <div className=" mt-1 lg:text-2xl text-xl w-full bg- p-3 text-sky-200  ">

        Play Now 

        </div>
        </div>

        
        
    </div>
}