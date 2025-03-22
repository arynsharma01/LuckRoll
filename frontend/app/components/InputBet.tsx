export default function InputBet(){
    return <div>
        <div className="flex flex-col">
            <div className="text-xl text-white py-2">
                Bet Amount

            </div>

        
        <input type="number" className="flex p-2 lg:min-w-24  lg:h-16 border-2 rounded-xl justify-center items-center text-md font-bold text-white bg-slate-900 hover:bg-white hover:cursor-pointer hover:shadow-2xl hover:shadow-sky-200"/>
        </div>
    </div>
}