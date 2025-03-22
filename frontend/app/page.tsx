import LuckRoll from "./games/luckroll/page";

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-700 min-h-screen w-full">
      
      {children}
    </div>
  );
}
