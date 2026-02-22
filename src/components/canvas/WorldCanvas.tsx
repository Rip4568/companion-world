import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Sky,
  Float,
  Billboard,
  useTexture,
  Sparkles,
} from "@react-three/drei";
import { useCompanionStore } from "../../store/useCompanionStore";
import type { ElementType } from "../../store/useCompanionStore";

function Island() {
  return (
    <group position={[0, -2, 0]}>
      {/* Base Float for the whole island */}
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.5}>
        <mesh receiveShadow>
          <cylinderGeometry args={[8, 6, 2, 64]} />
          <meshStandardMaterial color="#2d4c1e" roughness={0.8} />
        </mesh>

        {/* Dirt bottom */}
        <mesh position={[0, -1.5, 0]} receiveShadow>
          <cylinderGeometry args={[6, 4, 1, 64]} />
          <meshStandardMaterial color="#4a3b2c" roughness={0.9} />
        </mesh>
      </Float>
    </group>
  );
}

function TexturedSprite({ url }: { url: string }) {
  const tex = useTexture(url);
  return <meshBasicMaterial map={tex} transparent side={2} />;
}

function CompanionSprite({
  companion,
  position,
}: {
  companion: {
    id: string;
    name: string;
    element: ElementType;
    hp: number;
    maxHp: number;
  };
  position: [number, number, number];
}) {
  // Simulating Billboarding with a basic mesh for now until we load the user images
  // We will map the images to elements
  const colorMap: Record<ElementType, string> = {
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
    normal: "#ffffff",
  };

  const spriteColor = colorMap[companion.element] || "#ffffff";

  const textureFiles: Partial<Record<ElementType, string>> = {
    fire: "/assets/monster_fire_concept_1771723381562.png",
    water: "/assets/monster_water_concept_1771723397494.png",
    earth: "/assets/monster_earth_concept_1771723411624.png",
    plant: "/assets/monster_plant_concept_1771723427171.png",
    ice: "/assets/monster_ice_concept_1771723441859.png",
    electric: "/assets/monster_electric_concept_1771723456331.png",
    lava: "/assets/monster_lava_concept_1771721196539.png",
    swamp: "/assets/monster_swamp_concept_1771721212316.png",
    magma: "/assets/monster_magma_concept_1771723471450.png",
    nature: "/assets/monster_nature_concept_1771723486945.png",
  };

  const spriteUrl = textureFiles[companion.element];

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        <Billboard
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
          position={[0, 1.5, 0]}
        >
          {spriteUrl ? (
            <mesh scale={[3, 3, 1]}>
              <planeGeometry args={[1, 1]} />
              <Suspense fallback={<group />}>
                <TexturedSprite url={spriteUrl} />
              </Suspense>
            </mesh>
          ) : (
            <mesh castShadow>
              <capsuleGeometry args={[0.5, 0.8, 16, 32]} />
              <meshStandardMaterial
                color={spriteColor}
                emissive={spriteColor}
                emissiveIntensity={0.4}
                roughness={0.2}
              />
            </mesh>
          )}
        </Billboard>
        <Sparkles
          count={30}
          scale={2}
          size={4}
          speed={0.4}
          opacity={0.6}
          position={[0, 1, 0]}
          color={spriteColor}
        />
      </Float>
    </group>
  );
}

export default function WorldCanvas() {
  const companions = useCompanionStore((state) => state.companions);

  return (
    <Canvas camera={{ position: [0, 5, 12], fov: 45 }} shadows>
      <color attach="background" args={["#0f172a"]} />

      <Sky sunPosition={[10, -2, -10]} turbidity={0.5} rayleigh={0.8} />

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        color="#ffecd6"
      />
      <Environment preset="night" />

      <Island />

      <Suspense fallback={null}>
        {/* Render up to 5 companions linearly to test */}
        {companions.slice(0, 5).map((companion, index) => {
          const angle = (index / Math.min(companions.length, 5)) * Math.PI * 2;
          const radius = 4;
          return (
            <CompanionSprite
              key={companion.id}
              companion={companion}
              position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
            />
          );
        })}
      </Suspense>

      <OrbitControls
        makeDefault
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={6}
        maxDistance={25}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
