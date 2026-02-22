import { useEffect } from "react";
import { useGameStore } from "./store/useGameStore";
import { useCompanionStore } from "./store/useCompanionStore";
import Encyclopedia from "./components/ui/Encyclopedia";
import BreedingArena from "./components/ui/BreedingArena";
import WorldCanvas from "./components/canvas/WorldCanvas";
import HUD from "./components/ui/HUD";
import Shop from "./components/ui/Shop";
import BattleArena from "./components/ui/BattleArena";
import LandingPage from "./components/ui/LandingPage";

function App() {
  const currentScreen = useGameStore((state) => state.currentScreen);

  // Global IDLE Tick Loop
  useEffect(() => {
    const TICK_RATE = 5000; // a cada 5 segundos

    const interval = setInterval(() => {
      const companionsStore = useCompanionStore.getState();
      const gameStore = useGameStore.getState();

      let generatedGold = 0;

      companionsStore.companions.forEach((comp) => {
        if (comp.activity === "working") {
          const hungerDrain = 2;
          if (comp.hunger <= 0) {
            // Acabou a fome, para de trabalhar e muda pra idle
            companionsStore.setCompanionActivity(comp.id, "idle");
          } else {
            // Continua trabalhando, drena fome, gera ouro
            companionsStore.feed(comp.id, -hungerDrain);
            generatedGold += 2; // Cada pet gera 2 Gold por tick
          }
        }
      });

      if (generatedGold > 0) {
        gameStore.addGold(generatedGold);
      }
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-900 text-slate-100">
      {/* 3D World is always rendered behind the UI if we are in world or breeding */}
      {(currentScreen === "world" || currentScreen === "breeding") && (
        <div className="absolute inset-0 z-0">
          <WorldCanvas />
        </div>
      )}

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* HUD is visible in game screens */}
        {(currentScreen === "world" ||
          currentScreen === "breeding" ||
          currentScreen === "shop") && (
          <div className="pointer-events-auto">
            <HUD />
          </div>
        )}

        {/* Screens (pointer-events-auto re-enables interaction for UI) */}
        <div className="pointer-events-auto h-full w-full">
          {currentScreen === "encyclopedia" && <Encyclopedia />}
          {currentScreen === "breeding" && <BreedingArena />}
          {currentScreen === "shop" && <Shop />}
          {currentScreen === "battle" && <BattleArena />}
          {currentScreen === "landing" && <LandingPage />}
        </div>
      </div>
    </div>
  );
}

export default App;
