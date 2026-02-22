import { motion } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";
import { useCompanionStore } from "../../store/useCompanionStore";
import { useState } from "react";
import { X } from "lucide-react";

export default function BreedingArena() {
  const setScreen = useGameStore((state) => state.setScreen);
  const companions = useCompanionStore((state) => state.companions);
  const breed = useCompanionStore((state) => state.breed);

  const [parent1, setParent1] = useState<string | null>(null);
  const [parent2, setParent2] = useState<string | null>(null);

  const handleBreed = () => {
    if (parent1 && parent2) {
      breed(parent1, parent2);
      setScreen("world");
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-2xl p-8 relative border-2 border-brand-primary/20"
      >
        <button
          onClick={() => setScreen("world")}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer bg-white/5 p-2 rounded-full hover:bg-white/10"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-orange-400">
            Arena de Cruzamento
          </h2>
          <p className="text-slate-400">
            Combine dois companions para criar uma nova raça mais forte!
          </p>
        </div>

        <div className="flex gap-8 justify-center items-center my-8">
          <div className="w-40 h-40 glass-panel border border-dashed border-brand-primary/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative">
            {parent1 ? (
              <div className="text-center">
                <span className="font-bold block text-lg">
                  {companions.find((c) => c.id === parent1)?.name}
                </span>
                <span className="text-xs text-brand-primary uppercase tracking-widest">
                  {companions.find((c) => c.id === parent1)?.element}
                </span>
                <button
                  onClick={() => setParent1(null)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <span className="text-white/40 font-bold uppercase tracking-wider">
                Selecionar Pai 1
              </span>
            )}
          </div>

          <div className="text-5xl font-light text-brand-primary animate-pulse">
            +
          </div>

          <div className="w-40 h-40 glass-panel border border-dashed border-brand-primary/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors relative">
            {parent2 ? (
              <div className="text-center">
                <span className="font-bold block text-lg">
                  {companions.find((c) => c.id === parent2)?.name}
                </span>
                <span className="text-xs text-brand-primary uppercase tracking-widest">
                  {companions.find((c) => c.id === parent2)?.element}
                </span>
                <button
                  onClick={() => setParent2(null)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <span className="text-white/40 font-bold uppercase tracking-wider">
                Selecionar Pai 2
              </span>
            )}
          </div>
        </div>

        {/* Companion Selector List */}
        {(!parent1 || !parent2) && (
          <div className="mt-8 mb-6 overflow-x-auto pb-4">
            <h3 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-3">
              Escolher Companion:
            </h3>
            <div className="flex gap-4">
              {companions
                .filter((c) => c.id !== parent1 && c.id !== parent2)
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() =>
                      !parent1 ? setParent1(c.id) : setParent2(c.id)
                    }
                    className="shrink-0 glass-panel p-4 rounded-xl border border-white/10 hover:border-brand-primary/50 text-left min-w-[150px]"
                  >
                    <p className="font-bold">{c.name}</p>
                    <p className="text-xs text-brand-accent uppercase">
                      {c.element}
                    </p>
                  </button>
                ))}
            </div>
          </div>
        )}

        <button
          onClick={handleBreed}
          disabled={!parent1 || !parent2}
          className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${
            parent1 && parent2
              ? "bg-gradient-to-r from-brand-primary to-orange-500 text-white shadow-[0_0_20px_rgba(255,74,90,0.4)] hover:scale-105 active:scale-95"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
        >
          {parent1 && parent2 ? "Realizar Cruzamento!" : "Selecione os Pais"}
        </button>
      </motion.div>
    </div>
  );
}
