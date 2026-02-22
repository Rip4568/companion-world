import { motion } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";
import { getTexturePath } from "../../utils/gameLogic/assets";
import { Play, Sparkles, Diamond, Pickaxe, Coins } from "lucide-react";

export default function LandingPage() {
  const setScreen = useGameStore((state) => state.setScreen);

  const previewMonsters = ["fire", "water", "earth", "celestial"];

  return (
    <div className="w-full h-full bg-[#020617] text-white overflow-x-hidden overflow-y-auto relative font-sans selection:bg-purple-500/30">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 w-full p-6 flex justify-between items-center z-50 backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Diamond className="text-purple-400" size={24} />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 tracking-wider">
            Companion World
          </h1>
        </div>
        <button
          onClick={() => setScreen("world")}
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all font-medium cursor-pointer"
        >
          Entrar no DAPP
        </button>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-screen text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 mb-8 text-sm font-medium">
            <Sparkles size={14} />
            <span>Em Construção - Beta Fechado</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            Colecione, Batalhe e Evolua seus{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              Companions NFT
            </span>
          </h2>

          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Entre no universo de Companion World. Cada monstrinho é um ativo
            digital único e poderoso na blockchain. Cruzamento genético,
            mutações extremas e combates épicos te aguardam.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen("world")}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.5)] transition-all border border-purple-400/50"
            >
              <Play fill="currentColor" size={20} />
              JOGAR AGORA
            </motion.button>
            <div className="text-slate-400 text-sm flex flex-col items-start px-4">
              <span className="font-semibold text-white">
                Preço Fixo de Mint:
              </span>
              <span className="text-green-400 font-bold text-lg">R$ 20,00</span>{" "}
              por Companion
            </div>
          </div>
        </motion.div>

        {/* Feature Cards / Monsters Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl"
        >
          {previewMonsters.map((element, idx) => (
            <div
              key={element}
              className="relative group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all flex flex-col items-center cursor-pointer overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <motion.img
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: idx * 0.2 }}
                src={getTexturePath(element)}
                alt={`${element} companion`}
                className="w-32 h-32 object-contain mb-4 drop-shadow-2xl relative z-10"
              />
              <h3 className="text-xl font-bold capitalize text-white relative z-10">
                {element}
              </h3>
              <p className="text-xs text-slate-400 uppercase mt-1 tracking-widest relative z-10">
                Raça Pura
              </p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* IDLE System Section */}
      <section className="py-24 px-6 relative w-full flex justify-center border-t border-white/5 bg-gradient-to-b from-[#020617] to-purple-900/10">
        <div className="max-w-5xl flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex-1 space-y-6 text-center md:text-left"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Farm Passivo <span className="text-yellow-400">IDLE</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Sem tempo para batalhar? Sem problemas! Mande seus Companions
              trabalharem nas minas enquanto você está ausente. Gere{" "}
              <b>Ouro Diário</b> passivamente e troque por recursos vitais na
              evolução dos seus pets digitais NFT.
            </p>
            <div className="flex justify-center md:justify-start gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 glass-panel border border-yellow-500/30 text-yellow-300 font-bold rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <Pickaxe size={20} /> Trabalhar
              </div>
              <div className="flex items-center gap-2 px-4 py-2 glass-panel border border-yellow-500/30 text-yellow-300 font-bold rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <Coins size={20} /> +2 Gold / min
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex-1 relative"
          >
            <div className="aspect-square max-w-[400px] w-full mx-auto relative flex items-center justify-center">
              <div className="absolute inset-0 bg-yellow-500/20 blur-[100px] rounded-full" />
              <img
                src={getTexturePath("earth")}
                alt="Working Companion"
                className="w-64 object-contain drop-shadow-2xl relative z-10"
              />
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-10 right-10 z-20"
              >
                <Pickaxe className="text-yellow-400 drop-shadow-lg" size={48} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm border-t border-white/5 bg-black/50">
        <p>© 2026 Companion World. Todos os direitos reservados.</p>
        <p className="mt-2">Integração Blockchain em breve.</p>
      </footer>
    </div>
  );
}
