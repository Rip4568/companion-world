import { useGameStore } from "../../store/useGameStore";
import {
  Coins,
  HeartHandshake,
  BookOpen,
  Store,
  Swords,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function HUD() {
  const { gold, foodCount, setScreen } = useGameStore();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const navButtons = [
    {
      id: "encyclopedia",
      icon: BookOpen,
      label: "Enciclopédia",
      color: "text-blue-400",
      bgHover: "hover:bg-blue-500/20",
      borderHover: "hover:border-blue-400/50",
      shadow: "hover:shadow-[0_0_20px_rgba(96,165,250,0.5)]",
    },
    {
      id: "breeding",
      icon: HeartHandshake,
      label: "Cruzamento",
      color: "text-brand-primary",
      bgHover: "hover:bg-brand-primary/20",
      borderHover: "hover:border-brand-primary/50",
      shadow: "hover:shadow-[0_0_20px_rgba(255,74,90,0.5)]",
    },
    {
      id: "shop",
      icon: Store,
      label: "Market",
      color: "text-yellow-400",
      bgHover: "hover:bg-yellow-500/20",
      borderHover: "hover:border-yellow-400/50",
      shadow: "hover:shadow-[0_0_20px_rgba(250,204,21,0.5)]",
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none p-4 md:p-8 flex flex-col justify-between overflow-hidden">
      {/* Top Bar - Recurso em Pílulas */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pointer-events-auto flex justify-between items-start"
      >
        <button
          onClick={() => setScreen("landing")}
          className="flex items-center gap-2 bg-black/40 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 backdrop-blur-md px-5 py-2.5 rounded-full transition-all group cursor-pointer text-white/70 hover:text-white"
        >
          <LogOut
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium text-sm">Sair</span>
        </button>

        <div className="flex gap-3">
          {/* Gold Pill */}
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 backdrop-blur-md pl-3 pr-4 py-2 rounded-full shadow-lg">
            <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50">
              <Coins size={14} className="text-yellow-400 drop-shadow-md" />
            </div>
            <span className="text-white font-bold tracking-wide">{gold}</span>
          </div>

          {/* Food Pill */}
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 backdrop-blur-md pl-3 pr-4 py-2 rounded-full shadow-lg">
            <div className="w-6 h-6 flex items-center justify-center pb-1">
              <span className="text-lg drop-shadow-md">🍎</span>
            </div>
            <span className="text-white font-bold tracking-wide">
              {foodCount}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Bottom Bar - Dock Action Wheel */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="pointer-events-auto flex flex-col items-center gap-4 pb-2"
      >
        <div className="flex items-end justify-center gap-4 md:gap-6 bg-black/30 backdrop-blur-md border border-white/10 p-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {navButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <div
                key={btn.id}
                className="relative flex flex-col items-center"
                onMouseEnter={() => setHoveredButton(btn.id)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <AnimatePresence>
                  {hoveredButton === btn.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: -8, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full mb-2 whitespace-nowrap px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs font-bold text-white shadow-xl pointer-events-none"
                    >
                      {btn.label}
                      {/* Tooltip Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-solid border-t-slate-900 border-t-8 border-x-transparent border-x-8 border-b-0"></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => setScreen(btn.id as any)}
                  className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-sm cursor-pointer transition-all duration-300 ${btn.bgHover} ${btn.borderHover} ${btn.shadow} hover:-translate-y-2 group`}
                >
                  <Icon
                    size={28}
                    className={`${btn.color} group-hover:scale-110 transition-transform duration-300 drop-shadow-md`}
                  />
                </button>
              </div>
            );
          })}

          <div className="w-px h-12 bg-white/10 mx-2 self-center rounded-full"></div>

          {/* Battle PVE CTA - Bigger and Out of the box */}
          <div
            className="relative flex flex-col items-center"
            onMouseEnter={() => setHoveredButton("battle")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <AnimatePresence>
              {hoveredButton === "battle" && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: -16, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full mb-2 whitespace-nowrap px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-xs font-bold text-white shadow-xl pointer-events-none"
                >
                  Arena PVE
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-solid border-t-slate-900 border-t-8 border-x-transparent border-x-8 border-b-0"></div>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.1, translateY: -8 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setScreen("battle")}
              className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-700 to-red-600 border-2 border-purple-400/50 cursor-pointer shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:shadow-[0_0_50px_rgba(168,85,247,0.8)] z-10 -translate-y-2"
            >
              <Swords
                size={34}
                className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
