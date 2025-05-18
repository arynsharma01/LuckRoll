"use client"

import { Button } from "@/components/ui/button"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
    
  } from "@/components/ui/input-otp"
import axios from "axios"
import { useState } from "react"

  
  let patternRegex = "//d"

  export function InputOTPDemo() {
    const [otp , setOtp ] = useState("")
    async function verifyOtp() {
      axios.post('http://localhost:3001/luckroll/v1/user/signup/verify/otp' , {
        id:"",
        otp: Number(otp)
      })
    }
    return (
      <div className="  min-w-[40%] w-full border-2 border-white h-[60vh] bg-black rounded-2xl  ">
      
      <div  className="flex flex-col items-center justify-center m gap-10 p-2 h-full w-full">
        

        <div className="text-center text-3xl font-bold text-white">We've sent an OTP to your email. </div>

      <InputOTP maxLength={4} value={otp} onChange={(value)=>{
        setOtp(value)
        
      }}  >
        <InputOTPGroup className="w-full  " >
          <InputOTPSlot className="" index={0} />
          <InputOTPSlot className="b" index={1} />
          <InputOTPSlot className="b" index={2} />
          <InputOTPSlot className="b" index={3} />
          
        </InputOTPGroup>
      </InputOTP>

      <Button className={` hover:bg-white hover:cursor-pointer hover:text-black w-24 ${(otp.length<4)?"cursor-not-allowed pointer-events-none bg-blue-800 ":"bg-blue-600"}`} 
        onClick={()=>{
          
        }}
      >Verify </Button>

      </div>
      </div>
    )
  }
  