import GameCard from "./components/GameCard";
import Loader from "./components/loader";

import LuckRoll from "./games/luckroll/page";

export default function Home() {
  return (
    <div className="bg-slate-800 min-h-screen w-full flex flex-col p-20">
      <div>
        
        <GameCard/>
      </div>
      
    </div>
  );
}
