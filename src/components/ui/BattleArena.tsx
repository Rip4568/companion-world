import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Stars,
  Float,
  Billboard,
  useTexture,
  Sparkles,
  ContactShadows,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";
import {
  useCompanionStore,
  type Companion,
} from "../../store/useCompanionStore";
import {
  useBattleStore,
  getSkillForElement,
  calculateElementalMultiplier,
} from "../../store/useBattleStore";
import { getTexturePath } from "../../utils/gameLogic/assets";
import { ArrowLeft, Swords, Shield, HeartPulse, Zap } from "lucide-react";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

// --- THREE.JS BATTLE STAGE ---
function BattleGround() {
  return (
    <group position={[0, -2, 0]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#020617" roughness={0.8} />
      </mesh>

      {/* Player Pedestal */}
      <mesh position={[-4, 0.25, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 3, 0.5, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.8} />
      </mesh>
      {/* Enemy Pedestal */}
      <mesh position={[4, 0.25, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 3, 0.5, 32]} />
        <meshStandardMaterial color="#450a0a" metalness={0.6} roughness={0.9} />
      </mesh>
    </group>
  );
}

function FighterSprite({
  url,
  position,
  element,
  animatingAttack,
  isPlayer,
  hp,
}: {
  url: string;
  position: [number, number, number];
  element: string;
  animatingAttack: boolean;
  isPlayer: boolean;
  hp: number;
}) {
  const tex = useTexture(url);
  const groupRef = useRef<THREE.Group>(null);
  const colorMap: Record<string, string> = {
    fire: "#ef4444",
    water: "#3b82f6",
    earth: "#8b4513",
    plant: "#22c56e",
    ice: "#7dd3fc",
    electric: "#eab308",
    lava: "#dc2626",
    swamp: "#166534",
    magma: "#991b1b",
    nature: "#10b981",
    plasma: "#fb923c",
    storm: "#60a5fa",
    celestial: "#fef08a",
    cosmic: "#c084fc",
    abyssal: "#4c1d95",
    normal: "#ffffff",
  };
  const spriteColor = colorMap[element] || "#fff";

  // Simulate an attack lunge or faint drop
  const isFainted = hp <= 0;
  const yOffset = isFainted ? -1.5 : 0;
  const zRotation = isFainted ? Math.PI / 2 : 0;

  const originalPos = new THREE.Vector3(
    position[0],
    position[1] + yOffset,
    position[2],
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Animação de Avanço/Ataque (Dash Frontal + Pulo)
    if (animatingAttack && !isFainted) {
      const targetZ = isPlayer ? 3 : -3;
      const targetY = isPlayer ? 1 : 1;
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        targetZ,
        12 * delta,
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        12 * delta,
      );
    } else {
      // Retorna para a posição original
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        originalPos.x,
        8 * delta,
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        originalPos.y,
        8 * delta,
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        originalPos.z,
        8 * delta,
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1] + yOffset, position[2]]}
    >
      <Float
        speed={animatingAttack ? 15 : 2}
        rotationIntensity={isFainted ? 0 : animatingAttack ? 0.5 : 0.1}
        floatIntensity={isFainted ? 0 : animatingAttack ? 2 : 0.5}
      >
        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.8}
          scale={4}
          blur={2}
        />
        <Billboard follow={true}>
          <mesh scale={[4.5, 4.5, 1]} rotation={[0, 0, zRotation]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={tex}
              transparent
              side={2}
              opacity={isFainted ? 0.3 : 1}
            />
          </mesh>
        </Billboard>

        {!isFainted && (
          <Sparkles
            count={animatingAttack ? 150 : 40}
            scale={animatingAttack ? 6 : 3.5}
            size={animatingAttack ? 15 : 6}
            speed={animatingAttack ? 5 : 0.6}
            color={spriteColor}
          />
        )}
      </Float>
    </group>
  );
}

// --- MAIN UI COMPONENT ---
export default function BattleArena() {
  const { setScreen, addGold } = useGameStore();
  const companions = useCompanionStore((state) => state.companions);

  const {
    status,
    animatingAttack,
    playerFighter,
    enemyFighter,
    nextEnemy,
    battleLog,
    startBattle,
    executePlayerTurn,
    flee,
  } = useBattleStore();

  useEffect(() => {
    // Generate an enemy immediately when entering the battle screen if none exists
    if (!nextEnemy && !playerFighter && !enemyFighter) {
      useBattleStore.getState().generateNextEnemy();
    }
    return () => {
      flee();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectCompanion = (comp: Companion) => {
    if (comp.hp <= 0 || comp.hunger <= 0) {
      alert("Este companion não pode batalhar (Sem HP ou Faminto).");
      return;
    }
    if (comp.activity === "working") {
      alert("Este companion está trabalhando e não pode batalhar agora.");
      return;
    }
    startBattle(comp);
  };

  const handleFlee = () => {
    flee();
    setScreen("world");
  };

  const handleEndBattle = () => {
    if (status === "victory") {
      addGold(30);
    }
    flee();
  };

  if (!playerFighter) {
    return (
      <div className="w-full h-full bg-slate-900 overflow-y-auto p-8 relative">
        <button
          onClick={() => setScreen("world")}
          className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 glass-panel text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} /> Fechar
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto mt-20"
        >
          <h2 className="text-5xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            Arena de Batalha PVE
          </h2>

          {nextEnemy && (
            <div className="flex flex-col items-center mb-12 animate-pulse">
              <p className="text-red-400 font-bold mb-2 uppercase tracking-widest text-sm">
                Próximo Oponente
              </p>
              <div className="glass-panel p-4 border border-red-500/30 flex items-center gap-4 bg-red-500/10">
                <img
                  src={getTexturePath(nextEnemy.element)}
                  className="w-16 h-16 object-contain drop-shadow-lg"
                />
                <div>
                  <h3 className="font-bold text-xl text-white">
                    {nextEnemy.name}
                  </h3>
                  <p className="text-xs text-red-300">
                    Level 1 - {nextEnemy.element}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companions.map((comp) => {
              const cantFight =
                comp.hp <= 0 || comp.hunger <= 0 || comp.activity === "working";
              let effMultiplier = 1;
              if (nextEnemy) {
                effMultiplier = calculateElementalMultiplier(
                  comp.element,
                  nextEnemy.element,
                );
              }

              return (
                <div
                  key={comp.id}
                  onClick={() => handleSelectCompanion(comp)}
                  className={`glass-panel p-6 flex flex-col items-center gap-4 relative border transition-colors cursor-pointer ${
                    cantFight
                      ? "opacity-50 grayscale cursor-not-allowed border-white/5"
                      : "border-white/5 hover:border-red-500/50 hover:bg-red-500/10"
                  }`}
                >
                  {comp.activity === "working" && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase shadow">
                      Trabalhando
                    </div>
                  )}
                  {nextEnemy && !cantFight && effMultiplier !== 1 && (
                    <div
                      className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1 ${effMultiplier > 1 ? "bg-green-500/20 text-green-400 border border-green-500/50" : "bg-red-500/20 text-red-400 border border-red-500/50"}`}
                    >
                      <Zap size={10} />
                      {effMultiplier > 1 ? "+50% Dano" : "-50% Dano"}
                    </div>
                  )}

                  <img
                    src={getTexturePath(comp.element)}
                    alt={comp.name}
                    className="w-24 h-24 object-contain drop-shadow-lg"
                  />
                  <h3 className="text-xl font-bold text-white">{comp.name}</h3>
                  <div className="flex gap-4 text-sm text-slate-300 w-full justify-center">
                    <span className="flex items-center gap-1 font-bold text-green-400">
                      <HeartPulse size={14} /> {comp.hp}/{comp.maxHp}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-red-400">
                      <Swords size={14} /> {comp.atk}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-blue-400">
                      <Shield size={14} /> {comp.def}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-black text-white">
      {/* 3D CANVAS BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 2, 12], fov: 45 }} shadows>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[0, 10, 5]}
            intensity={1.5}
            castShadow
            color="#ef4444"
          />
          <spotLight
            position={[10, 10, -10]}
            intensity={2}
            color="#3b82f6"
            penumbra={1}
          />

          <Stars
            radius={50}
            depth={20}
            count={2000}
            factor={3}
            saturation={1}
            fade
            speed={2}
          />
          <Environment preset="night" />

          <BattleGround />

          <Suspense fallback={null}>
            <FighterSprite
              url={getTexturePath(playerFighter.element)}
              position={[-4, 0.5, 0]}
              element={playerFighter.element}
              isPlayer={true}
              animatingAttack={animatingAttack === "player"}
              hp={playerFighter.hp}
            />

            {enemyFighter && (
              <FighterSprite
                url={getTexturePath(enemyFighter.element)}
                position={[4, 0.5, 0]}
                element={enemyFighter.element}
                isPlayer={false}
                animatingAttack={animatingAttack === "enemy"}
                hp={enemyFighter.hp}
              />
            )}
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* HTML UI OVERLAY */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
        {/* Top Bar */}
        <div className="p-8 flex justify-between items-start w-full">
          <button
            onClick={handleFlee}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 glass-panel text-white hover:bg-red-500/20 hover:border-red-500 transition-colors cursor-pointer backdrop-blur-md"
          >
            <ArrowLeft size={20} /> Fugir
          </button>

          <div className="flex gap-32">
            {/* Player Stats */}
            <div className="glass-panel px-6 py-4 min-w-[250px] border border-blue-500/30 backdrop-blur-md">
              <h3 className="font-bold text-xl">{playerFighter.name}</h3>
              <p className="text-xs text-blue-300 uppercase mb-2">
                {playerFighter.element} Lvl. 1
              </p>
              <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden border border-white/10">
                <motion.div
                  className="bg-green-500 h-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                  initial={{ width: "100%" }}
                  animate={{
                    width: `${(playerFighter.hp / playerFighter.maxHp) * 100}%`,
                  }}
                />
              </div>
              <p className="text-right text-xs mt-1 font-bold">
                {playerFighter.hp} / {playerFighter.maxHp}
              </p>
            </div>

            {/* Enemy Stats */}
            {enemyFighter && (
              <div className="glass-panel px-6 py-4 min-w-[250px] border border-red-500/30 backdrop-blur-md text-right">
                <h3 className="font-bold text-xl">{enemyFighter.name}</h3>
                <p className="text-xs text-red-400 uppercase mb-2">
                  Wild {enemyFighter.element}
                </p>
                <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden border border-white/10 rotate-180">
                  <motion.div
                    className="bg-red-500 h-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                    initial={{ width: "100%" }}
                    animate={{
                      width: `${(enemyFighter.hp / enemyFighter.maxHp) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-left text-xs mt-1 font-bold">
                  {enemyFighter.hp} / {enemyFighter.maxHp}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions UI Overlay */}
        <div className="w-full bg-gradient-to-t from-black via-slate-900/90 to-transparent pt-32 pb-6 px-12 flex gap-8 pointer-events-auto items-end">
          {/* Battle Logs Log */}
          <div className="flex-1 glass-panel p-4 overflow-y-auto max-h-40 text-sm text-slate-300 font-mono flex flex-col-reverse border border-white/5 bg-black/50 backdrop-blur-lg">
            {battleLog
              .map((log, i) => (
                <p key={i} className="mb-2">
                  <span className="text-brand-accent">{"> "}</span>
                  {log}
                </p>
              ))
              .reverse()}
          </div>

          {/* Actions */}
          <div className="w-1/3 flex flex-col justify-end min-h-[120px]">
            <AnimatePresence mode="wait">
              {status === "player_turn" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => executePlayerTurn()}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-extrabold py-5 px-6 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400 cursor-pointer text-lg tracking-wider"
                  >
                    Atacar com {getSkillForElement(playerFighter.element).name}
                  </motion.button>
                </motion.div>
              )}

              {status === "enemy_turn" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center p-6 glass-panel border-red-500/50 bg-red-500/10 text-xl font-bold text-red-400 animate-pulse w-full"
                >
                  Turno Inimigo...
                </motion.div>
              )}

              {(status === "victory" || status === "defeat") && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={handleEndBattle}
                  className={`w-full text-white font-bold py-5 px-6 rounded-2xl shadow-lg border cursor-pointer text-xl ${
                    status === "victory"
                      ? "bg-green-600 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                      : "bg-slate-700 border-slate-500"
                  }`}
                >
                  {status === "victory"
                    ? "🎉 Vencedor! (+30 Gold)"
                    : "💀 Retornar Derrotado"}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
