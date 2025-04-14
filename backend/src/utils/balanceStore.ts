
const balanceStore : Record<string ,number>  = {}

export function getBalance(email : string) : number {
    return balanceStore[email] ?? 0 

}


export function setBalance(email : string ,balance : number ) : void {
     balanceStore[email] = balance 
}


export function updateBalance(email : string , newBalance  : number){
    if (balanceStore[email] !== undefined) {
        balanceStore[email] += newBalance
    } else {
        balanceStore[email] = newBalance
    }
    }

    export default balanceStore