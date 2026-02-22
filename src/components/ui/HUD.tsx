import { useGameStore } from "../../store/useGameStore";
import { Coins, HeartHandshake, BookOpen } from "lucide-react";

export default function HUD() {
  const { gold, foodCount, setScreen } = useGameStore();

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="pointer-events-auto flex justify-between items-start">
        <button
          onClick={() => setScreen("menu")}
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
          <span className="font-bold text-sm text-white">Companions</span>
        </button>

        <button
          onClick={() => setScreen("breeding")}
          className="glass-panel p-4 flex flex-col items-center gap-2 hover:bg-brand-primary/20 hover:border-brand-primary transition-all rounded-2xl hover:-translate-y-2 group border border-white/10 cursor-pointer bg-gradient-to-t from-brand-primary/10 to-transparent"
        >
          <HeartHandshake
            size={32}
            className="text-brand-primary group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(255,74,90,0.8)]"
          />
          <span className="font-bold text-sm text-white drop-shadow-md">
            Cruzamento
          </span>
        </button>
      </div>
    </div>
  );
}
