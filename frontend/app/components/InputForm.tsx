
interface props {
    placeholder : string,
    heading : string ,
    type : string
    onChange : (value : any )=> void 
}
export default function InputForm({placeholder ,heading ,type ,onChange} : props){
    return <div>
        <div className="flex flex-col p-2 justify-between gap-2">

        
        <div className="text-2xl font-black text-white">
            {heading}
        </div>
        <input className="flex p-2 border-2 rounded-xl transition-all duration-200  bg-slate-700 hover:bg-slate-500 focus:bg-slate-600 focus:ring-2 focus:ring-sky-400 min-w-[25vh] text-lg" placeholder={placeholder} 
        type={type}
        required 
        onChange={(e)=>{
            onChange(e.target.value )
        }}
        
        ></input>

    </div>
    </div>
}