"use client"

import { useRouter } from "next/navigation"

export const DiceImage = () => {
    const router = useRouter()
    return (
    <div className="hover:cursor-pointer " onClick={()=>{
        router.push('/')
    }}>
        <img className="size-16" src="/dice.png" alt="" />
    </div>
    )
}