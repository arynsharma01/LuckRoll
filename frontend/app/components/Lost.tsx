"use client"
import dynamic from "next/dynamic";
import WinAnimate from "./AnimationData/winAnimate.json";

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import lostAnimate from "./AnimationData/lostAnimate.json"
import { useState } from "react"
export const LostAnimation =()=>{
    const [render ,setRender] = useState<Boolean>(true)
    
      setTimeout(()=>{
        setRender(false)
      },1500)
    
    return (
        (render)?
        <div className="flex flex-col justify-center items-center    ">
            <Lottie animationData={lostAnimate} loop className="fixed top-40  z-50 size-64 " />
            <div className=" text-2xl  lg:text-4xl fixed shadow-sky-300 bg-slate-800 rounded-3xl shadow-2xl top-25 z-50 text-white p-2 ">Better Luck Next Time  </div>
        </div>:
        <div></div>
    )
}