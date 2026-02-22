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
        className="absolute top-8 left-8 flex items-center gap-2 px-6 py-3 bg-black/40 border border-white/10 hover:border-white/30 hover:bg-white/10 backdrop-blur-md text-white rounded-full transition-all cursor-pointer font-bold shadow-lg z-10 hover:-translate-y-1"
      >
        <ArrowLeft size={18} /> Hub
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
              <div className="flex justify-between items-center z-10 relative">
                <h3 className="text-xl font-black text-white flex items-center gap-2 drop-shadow-md">
                  {companion.name}
                  {companion.activity === "working" && (
                    <span className="text-[10px] bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full font-black uppercase tracking-wider animate-pulse shadow-lg">
                      Farmando
                    </span>
                  )}
                </h3>
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-accent shadow-md">
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

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleFeed(companion.id, companion.hunger)}
                    disabled={companion.hunger >= 100 || foodCount <= 0}
                    className="flex-1 flex flex-col items-center justify-center gap-1 py-3 bg-gradient-to-b from-green-600/20 to-green-900/40 hover:from-green-500/30 hover:to-green-800/50 text-green-400 border border-green-500/30 hover:border-green-400/60 rounded-xl font-bold disabled:opacity-30 disabled:grayscale transition-all cursor-pointer shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:-translate-y-1"
                  >
                    <Utensils size={18} />
                    <span className="text-[10px] uppercase tracking-wider">
                      Alimentar
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      setCompanionActivity(
                        companion.id,
                        companion.activity === "working" ? "idle" : "working",
                      )
                    }
                    disabled={companion.hunger <= 0}
                    className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl font-bold disabled:opacity-30 disabled:grayscale transition-all cursor-pointer border shadow-lg hover:-translate-y-1 ${
                      companion.activity === "working"
                        ? "bg-gradient-to-b from-red-600/20 to-red-900/40 hover:from-red-500/30 hover:to-red-800/50 text-red-400 border-red-500/30 hover:border-red-400/60 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                        : "bg-gradient-to-b from-yellow-600/20 to-yellow-900/40 hover:from-yellow-500/30 hover:to-yellow-800/50 text-yellow-400 border-yellow-500/30 hover:border-yellow-400/60 shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                    }`}
                  >
                    {companion.activity === "working" ? (
                      <>
                        <Moon size={18} />
                        <span className="text-[10px] uppercase tracking-wider">
                          Descansar
                        </span>
                      </>
                    ) : (
                      <>
                        <Pickaxe size={18} />
                        <span className="text-[10px] uppercase tracking-wider">
                          Trabalhar
                        </span>
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
