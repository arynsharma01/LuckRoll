import GameCard from "./components/GameCard";
import Loader from "./components/loader";
import { LostAnimation } from "./components/Lost";
import { WinAnimation } from "./components/Win";
import LuckRoll from "./games/luckroll/page";

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-800 min-h-screen w-full flex flex-col p-20">
      <div>
        
        <GameCard/>
      </div>
      {children}
    </div>
  );
}
