import { motion } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";
import { Play, Book, Settings } from "lucide-react";

export default function MainMenu() {
  const setScreen = useGameStore((state) => state.setScreen);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent mb-4 drop-shadow-[0_0_15px_rgba(255,74,90,0.5)]">
          Companion World
        </h1>
        <p className="text-xl text-slate-400">Combine, Crie e Colecione</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col gap-4 w-64"
      >
        <button
          onClick={() => setScreen("world")}
          className="flex items-center justify-center gap-2 py-4 px-6 bg-brand-primary hover:bg-[color:var(--color-brand-primary)] opacity-90 hover:opacity-100 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,74,90,0.4)]"
        >
          <Play size={24} /> Entrar no Mundo
        </button>

        <button
          onClick={() => setScreen("encyclopedia")}
          className="flex items-center justify-center gap-2 py-4 px-6 glass-panel hover:bg-white/10 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95"
        >
          <Book size={24} /> Enciclopédia
        </button>

        <button className="flex items-center justify-center gap-2 py-4 px-6 glass-panel hover:bg-white/10 text-white/50 rounded-xl font-bold text-lg transition-all cursor-not-allowed">
          <Settings size={24} /> Configurações
        </button>
      </motion.div>
    </div>
  );
}
