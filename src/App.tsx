import { useGameStore } from "./store/useGameStore";
import MainMenu from "./components/ui/MainMenu";
import Encyclopedia from "./components/ui/Encyclopedia";
import BreedingArena from "./components/ui/BreedingArena";
import WorldCanvas from "./components/canvas/WorldCanvas";
import HUD from "./components/ui/HUD";
import Shop from "./components/ui/Shop";
import BattleArena from "./components/ui/BattleArena";

function App() {
  const currentScreen = useGameStore((state) => state.currentScreen);

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
          {currentScreen === "menu" && <MainMenu />}
          {currentScreen === "encyclopedia" && <Encyclopedia />}
          {currentScreen === "breeding" && <BreedingArena />}
          {currentScreen === "shop" && <Shop />}
          {currentScreen === "battle" && <BattleArena />}
        </div>
      </div>
    </div>
  );
}

export default App;
