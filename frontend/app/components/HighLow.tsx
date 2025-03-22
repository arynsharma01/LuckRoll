"use client"

import { useCash } from "../context/CashContext"
import { Howl } from 'howler';
interface SelectProps {
    value: string
}

export default function HighLow({ value }: SelectProps) {
    const { highLow , setHighLow } = useCash()
    const sound = new Howl({
        src: ['/highlowsound.mp3'],
      });

    return (
        <div
            className={`flex p-2 lg:w-24 w-20 h-12 lg:h-16 border-2 rounded-xl justify-center items-center text-md font-bold text-white bg-slate-900 hover:bg-slate-700 hover:cursor-pointer hover:shadow-2xl hover:shadow-sky-200 
            ${(highLow === value  ) ? " border-green-400 bg-slate-700 shadow-md shadow-green-400" : "border-gray-600"}`}
            onClick={() => {
                setHighLow(value)
                
                sound.play()
            }}
        >
            {value}
        </div>
    );
}
