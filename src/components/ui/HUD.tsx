import { useGameStore } from "../../store/useGameStore";
import { Coins, HeartHandshake, BookOpen, Store, Swords } from "lucide-react";

export default function HUD() {
  const { gold, foodCount, setScreen } = useGameStore();

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="pointer-events-auto flex justify-between items-start">
        <button
          onClick={() => setScreen("landing")}
          className="glass-panel px-6 py-3 hover:bg-white/10 transition-colors rounded-xl font-bold border border-white/10 shadow-lg text-white cursor-pointer"
        >
          Sair do Jogo
        </button>

        <div className="flex gap-4">
          <div className="glass-panel px-6 py-3 flex items-center gap-3 rounded-xl text-brand-accent font-bold border border-white/5 shadow-lg bg-black/40">
            <Coins size={20} className="text-yellow-400" />
            <span className="text-xl">{gold}</span>
          </div>
          <div className="glass-panel px-6 py-3 flex items-center gap-3 rounded-xl text-green-400 font-bold border border-white/5 shadow-lg bg-black/40">
            <span className="text-2xl drop-shadow-md">🍎</span>
            <span className="text-xl">{foodCount}</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar Controls */}
      <div className="pointer-events-auto flex justify-center gap-6 pb-4">
        <button
          onClick={() => setScreen("encyclopedia")}
          className="glass-panel p-4 flex flex-col items-center gap-2 hover:bg-blue-500/20 hover:border-blue-400 transition-all rounded-2xl hover:-translate-y-2 group border border-white/10 cursor-pointer"
        >
          <BookOpen
            size={32}
            className="text-blue-400 group-hover:scale-110 transition-transform"
          />
          <span className="font-bold text-sm text-white drop-shadow-md">
            Companions
          </span>
        </button>

        <button
          onClick={() => setScreen("breeding")}
          className="glass-panel p-4 flex flex-col items-center gap-2 hover:bg-brand-primary/20 hover:border-brand-primary transition-all rounded-2xl hover:-translate-y-2 group border border-white/10 cursor-pointer"
        >
          <HeartHandshake
            size={32}
            className="text-brand-primary group-hover:scale-110 transition-transform"
          />
          <span className="font-bold text-sm text-white drop-shadow-md">
            Cruzamento
          </span>
        </button>

        <button
          onClick={() => setScreen("shop")}
          className="glass-panel p-4 flex flex-col items-center gap-2 hover:bg-yellow-500/20 hover:border-yellow-400 transition-all rounded-2xl hover:-translate-y-2 group border border-white/10 cursor-pointer"
        >
          <Store
            size={32}
            className="text-yellow-400 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
          />
          <span className="font-bold text-sm text-white drop-shadow-md">
            Loja
          </span>
        </button>

        <button
          onClick={() => setScreen("battle")}
          className="glass-panel p-4 flex flex-col items-center gap-2 hover:bg-purple-500/20 hover:border-purple-400 transition-all rounded-2xl hover:-translate-y-2 group border border-white/10 cursor-pointer opacity-70"
        >
          <Swords
            size={32}
            className="text-purple-400 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
          />
          <span className="font-bold text-sm text-white drop-shadow-md">
            Arena PVE
          </span>
        </button>
      </div>
    </div>
  );
}
