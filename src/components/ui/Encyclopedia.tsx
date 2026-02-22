import { motion } from "framer-motion";
import { useCompanionStore } from "../../store/useCompanionStore";
import { useGameStore } from "../../store/useGameStore";
import { getTexturePath } from "../../utils/gameLogic/assets";
import { ArrowLeft, Utensils, Pickaxe, Moon } from "lucide-react";

export default function Encyclopedia() {
  const companions = useCompanionStore((state) => state.companions);
  const feed = useCompanionStore((state) => state.feed);
  const setCompanionActivity = useCompanionStore(
    (state) => state.setCompanionActivity,
  );
  const { setScreen, foodCount, consumeFood } = useGameStore();

  const handleFeed = (id: string, currentHunger: number) => {
    if (currentHunger >= 100) return;
    if (consumeFood(1)) {
      feed(id, 20);
    } else {
      alert("Falta de maçãs elementais! (Food count = 0)");
    }
  };

  return (
    <div className="w-full h-full bg-slate-900 overflow-y-auto p-8 relative">
      <button
        onClick={() => setScreen("world")}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 glass-panel text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        <ArrowLeft size={20} /> Voltar
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mt-16"
      >
        <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-brand-secondary to-blue-400 drop-shadow-[0_0_10px_rgba(0,210,255,0.4)]">
          Meus Companions ({companions.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companions.map((companion) => (
            <div
              key={companion.id}
              className="glass-panel p-6 flex flex-col gap-4 hover:border-brand-primary/50 transition-colors border border-white/5"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {companion.name}
                  {companion.activity === "working" && (
                    <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse relative -top-1">
                      Em Trabalho
                    </span>
                  )}
                </h3>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider text-brand-accent">
                  {companion.element}
                </span>
              </div>
              <div className="flex justify-center -my-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <img
                  src={getTexturePath(companion.element)}
                  className="w-24 h-24 object-contain"
                  alt={companion.name}
                />
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>HP:</span>{" "}
                  <span className="text-green-400 font-bold">
                    {companion.hp}/{companion.maxHp}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span>Ataque:</span>{" "}
                  <span className="text-brand-primary font-bold">
                    {companion.atk}
                  </span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Defesa:</span>{" "}
                  <span className="text-blue-400 font-bold">
                    {companion.def}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Fome</span>
                    <span>{companion.hunger}%</span>
                  </div>
                  <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-400 h-full transition-all duration-500"
                      style={{ width: `${companion.hunger}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleFeed(companion.id, companion.hunger)}
                    disabled={companion.hunger >= 100 || foodCount <= 0}
                    className="flex-1 mt-4 flex items-center justify-center gap-2 py-2 bg-green-500/20 hover:bg-green-500/40 text-green-400 border border-green-500/30 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Utensils size={16} /> Alimentar
                  </button>

                  <button
                    onClick={() =>
                      setCompanionActivity(
                        companion.id,
                        companion.activity === "working" ? "idle" : "working",
                      )
                    }
                    disabled={companion.hunger <= 0}
                    className={`flex-1 mt-4 flex items-center justify-center gap-2 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer border ${companion.activity === "working" ? "bg-red-500/20 hover:bg-red-500/40 text-red-400 border-red-500/30" : "bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 border-yellow-500/30"}`}
                  >
                    {companion.activity === "working" ? (
                      <>
                        <Moon size={16} /> Descansar
                      </>
                    ) : (
                      <>
                        <Pickaxe size={16} /> Trabalhar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
