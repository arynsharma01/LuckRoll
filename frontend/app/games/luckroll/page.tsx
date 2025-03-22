import BetButton from "@/app/components/Betbutton";

import Dice from "@/app/components/Dice";
import HighLow from "@/app/components/HighLow";
import InputBet from "@/app/components/InputBet";
import Multiplier from "@/app/components/MultiplierButton";


export default function LuckRoll() {
    return <div className="flex   gap-4 items-center justify-center bg-slate-800 w-full min-h-screen">
        <div className="flex flex-col-reverse lg:flex-row  py-10 lg:px-20 px-5 items-center justify-center border border-white shadow-xl shadow-gray-500 rounded-2xl bg-slate-700 ">
            <div className="px-5 ">
                <div>
                    <InputBet />
                </div>

                <div className="text-white font-bold text-xl  pt-2">

                    Bet

                </div>
                <div className="flex  gap-2 pt-2  ">
                    <HighLow value="High" />
                    <HighLow value="Low" />

                </div>
                <div className="text-white font-bold text-xl  pt-2">

                    Risk

                </div>
                <div className="flex  gap-2 pt-2  ">
                    <Multiplier value="low" />
                    <Multiplier value="medium" />
                    <Multiplier value="high" />

                </div>
                <div className="w-full">
                    <BetButton />
                </div>

            </div>
            <div className="lg:pl-20 ">
                <Dice />
            </div>

        </div>



    </div>
}