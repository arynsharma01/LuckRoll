import { useCash } from "../context/CashContext"

export const ProfitCard = ()=>{
    const {betValue,multiplier} = useCash()
    if (betValue<0) {
        return 
    }
    let profit ;
    if (multiplier == "low") {
        profit = betValue * 1.2
    }
    else if(multiplier == "medium") profit= betValue *1.7
    else profit = betValue * 2.3 
    const total= profit
     profit =  profit -betValue
     
    return <div>
        <div className=" flex text-lg text-yellow-300 p-2  ">
            <div className="pr-2">
            Profit = {profit.toFixed(2)}
            </div> 
                Total = {total.toFixed(2)}

            
        </div>
    </div>
}