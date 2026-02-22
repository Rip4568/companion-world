import { motion } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";
import { useCompanionStore } from "../../store/useCompanionStore";
import {
  ArrowLeft,
  Coins,
  HeartPulse,
  Apple,
  Egg,
  Sparkles,
} from "lucide-react";

export default function Shop() {
  const { setScreen, gold, spendGold, addFood, addPotion, foodCount, potions } =
    useGameStore();
  const hatchEgg = useCompanionStore((state) => state.hatchEgg);

  const handleBuyFood = () => {
    if (spendGold(10)) {
      addFood(1);
    } else {
      alert("Ouro insuficiente!");
    }
  };

  const handleBuyPotion = () => {
    if (spendGold(50)) {
      addPotion(1);
    } else {
      alert("Ouro insuficiente!");
    }
  };

  const handleBuyBasicEgg = () => {
    if (spendGold(100)) {
      const comp = hatchEgg("basic");
      alert(
        `O Ovo Básico CHOCOU! Você obteve um(a) ${comp.name} (${comp.element})! 🌟`,
      );
    } else {
      alert("Ouro insuficiente para o Ovo Básico (100g)!");
    }
  };

  const handleBuyPremiumEgg = () => {
    if (spendGold(500)) {
      const comp = hatchEgg("premium");
      alert(
        `O Ovo Premium CHOCOU! Você obteve um PODEROSO(A) ${comp.name} (${comp.element})! ✨💥`,
      );
    } else {
      alert("Ouro insuficiente para o Ovo Premium (500g)!");
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
              <span className="text-[10px] font-black uppercase tracking-widest bg-green-500/20 text-green-400 px-2 py-1 rounded-md border border-green-500/30">
                Possui: {foodCount}
              </span>
            </div>

            <p className="text-sm text-slate-300 relative z-10 h-10">
              Restaura a felicidade e reduz a fome do companion em 20%.
            </p>

            <button
              onClick={handleBuyFood}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-yellow-600/20 to-yellow-800/40 hover:from-yellow-500/30 hover:to-yellow-700/50 text-yellow-400 border border-yellow-500/30 hover:border-yellow-400/60 rounded-xl font-bold transition-all cursor-pointer shadow-lg hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]"
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
              <span className="text-[10px] font-black uppercase tracking-widest bg-red-500/20 text-red-400 px-2 py-1 rounded-md border border-red-500/30">
                Possui: {potions}
              </span>
            </div>

            <p className="text-sm text-slate-300 relative z-10 h-10">
              Recupera +50 HP perdidos em batalhas PVE.
            </p>

            <button
              onClick={handleBuyPotion}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-600/20 to-red-800/40 hover:from-red-500/30 hover:to-red-700/50 text-red-400 border border-red-500/30 hover:border-red-400/60 rounded-xl font-bold transition-all cursor-pointer shadow-lg hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            >
              <Coins size={16} /> Comprar (50g)
            </button>
          </div>

          {/* Ovo Simples Gacha */}
          <div className="glass-panel p-6 flex flex-col gap-4 border border-blue-500/20 hover:border-blue-500/50 transition-colors relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all"></div>
            <div className="flex justify-between items-start relative z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Egg className="text-blue-400" /> Ovo Básico
              </h3>
            </div>
            <p className="text-sm text-slate-300 relative z-10 h-10">
              Sorteia um companion elemental. 18% para mistura, 2% taxa Divina
              GOD.
            </p>
            <button
              onClick={handleBuyBasicEgg}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600/20 to-blue-800/40 hover:from-blue-500/30 hover:to-blue-700/50 text-blue-300 border border-blue-500/30 hover:border-blue-400/60 rounded-xl font-bold transition-all cursor-pointer shadow-lg hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              <Coins size={16} /> Comprar Ovo (100g)
            </button>
          </div>

          {/* Ovo Premium */}
          <div className="glass-panel p-6 flex flex-col gap-4 border border-brand-secondary/20 hover:border-brand-secondary/50 transition-colors relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-secondary/10 rounded-full blur-xl group-hover:bg-brand-secondary/20 transition-all"></div>
            <div className="flex justify-between items-start relative z-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="text-brand-accent animate-pulse" /> Ovo
                Premium
              </h3>
            </div>
            <p className="text-sm text-slate-300 relative z-10 h-10">
              Alta chance de misturas (35%) e maior taxa de origem Divina (15%).
              Nascem fortes!
            </p>
            <button
              onClick={handleBuyPremiumEgg}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border border-yellow-400/50 rounded-xl font-black transition-all cursor-pointer shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:shadow-[0_0_30px_rgba(250,204,21,0.7)] hover:-translate-y-1 hover:scale-[1.02]"
            >
              <br className="hidden" />
              <Coins size={18} /> Chocar Premium (500g)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
