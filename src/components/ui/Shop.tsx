import { motion } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";
import { ArrowLeft, Coins, HeartPulse, Apple } from "lucide-react";

export default function Shop() {
  const { setScreen, gold, spendGold, addFood } = useGameStore();

  const handleBuyFood = () => {
    if (spendGold(10)) {
      addFood(1);
    } else {
      alert("Ouro insuficiente!");
    }
  };

  const handleBuyPotion = () => {
    if (spendGold(50)) {
      // Futuro inventário de poções se necessário, ou aplicar efeito agora
      alert("Poção comprada! (Efeito de cura será implementado na Batalha)");
    } else {
      alert("Ouro insuficiente!");
    }
  };

  return (
    <div className="w-full h-full bg-slate-900 overflow-y-auto p-8 relative">
      <button
        onClick={() => setScreen("world")}
        className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 glass-panel text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        <ArrowLeft size={20} /> Voltar para o Mundo
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mt-16"
      >
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]">
              Store & Supplies
            </h2>
            <p className="text-slate-400 mt-2">
              Invista seu ouro em suprimentos para seus companions.
            </p>
          </div>
          <div className="glass-panel px-6 py-3 flex items-center gap-3 rounded-xl text-brand-accent font-bold border border-yellow-500/30 shadow-[0_0_15px_rgba(250,204,21,0.2)] bg-black/40">
            <Coins size={24} className="text-yellow-400" />
            <span className="text-2xl">{gold}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Macã Elemental */}
          <div className="glass-panel p-6 flex flex-col gap-4 border border-green-500/20 hover:border-green-500/50 transition-colors relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-xl group-hover:bg-green-500/20 transition-all"></div>

            <div className="flex justify-between items-start relative z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Apple className="text-green-400" /> Maçã Elemental
              </h3>
            </div>

            <p className="text-sm text-slate-300 relative z-10 h-10">
              Restaura a felicidade e reduz a fome do companion em 20%.
            </p>

            <button
              onClick={handleBuyFood}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 border border-yellow-500/30 rounded-lg font-bold transition-colors cursor-pointer"
            >
              <Coins size={16} /> Comprar (10g)
            </button>
          </div>

          {/* Poção de Vida */}
          <div className="glass-panel p-6 flex flex-col gap-4 border border-red-500/20 hover:border-red-500/50 transition-colors relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all"></div>

            <div className="flex justify-between items-start relative z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <HeartPulse className="text-red-400" /> Poção de Cura
              </h3>
            </div>

            <p className="text-sm text-slate-300 relative z-10 h-10">
              Recupera +50 HP perdidos em batalhas PVE.
            </p>

            <button
              onClick={handleBuyPotion}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 border border-yellow-500/30 rounded-lg font-bold transition-colors cursor-pointer"
            >
              <Coins size={16} /> Comprar (50g)
            </button>
          </div>

          {/* Equipamento (Placeholder) */}
          <div className="glass-panel p-6 flex flex-col gap-4 border border-brand-secondary/20 hover:border-brand-secondary/50 transition-colors relative overflow-hidden group opacity-60">
            <div className="flex justify-between items-start relative z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Acessódio (Breve)
              </h3>
            </div>
            <p className="text-sm text-slate-300 relative z-10 h-10">
              Aumenta permanentemente o ataque ou defesa base do companion.
            </p>
            <button
              disabled
              className="w-full mt-4 py-3 bg-white/5 text-white/30 border border-white/10 rounded-lg font-bold cursor-not-allowed"
            >
              Indisponível
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
