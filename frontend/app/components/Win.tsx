"use client"
import dynamic from "next/dynamic";
import WinAnimate from "./AnimationData/winAnimate.json";

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import GameCard from "./GameCard";
import { useState } from "react";

export const WinAnimation = () => {

  const [render ,setRender] = useState<Boolean>(true)

  setTimeout(()=>{
    setRender(false)
  },1500)

  return (
    (render)?<div>
      <Lottie animationData={WinAnimate} loop= {true} className="pointer-events-none fixed top-20 left-0 w-full min-h-[100vh] z-50" />
      
    </div>:
      <div></div>
  
    
  );
};
