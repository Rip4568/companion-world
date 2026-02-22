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
  ContactShadows,
  Stars,
  Cloud,
} from "@react-three/drei";
import { getTexturePath, getElementColor } from "../../utils/gameLogic/assets";
import { useCompanionStore } from "../../store/useCompanionStore";
import type { ElementType } from "../../store/useCompanionStore";

function Island() {
  return (
    <group position={[0, -2, 0]}>
      <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.5}>
        {/* Grass Top */}
        <mesh receiveShadow position={[0, 0.8, 0]}>
          <cylinderGeometry args={[8.5, 9, 0.6, 64]} />
          <meshStandardMaterial color="#34d399" roughness={0.6} />
        </mesh>

        {/* Main Dirt Base */}
        <mesh receiveShadow position={[0, -1, 0]}>
          <cylinderGeometry args={[9, 6, 3, 64]} />
          <meshStandardMaterial color="#78350f" roughness={0.9} />
        </mesh>

        {/* Lower Spikes/Roots */}
        <mesh receiveShadow position={[0, -4, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[6, 4, 32]} />
          <meshStandardMaterial color="#451a03" roughness={1} />
        </mesh>

        {/* Floating Magic Rocks */}
        <mesh position={[8, 2, 4]} rotation={[0.4, 0.2, 0.5]} castShadow>
          <dodecahedronGeometry args={[1.5]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#a78bfa"
            emissiveIntensity={0.2}
            roughness={0.4}
          />
        </mesh>

        <mesh position={[-9, 1, -2]} rotation={[0.1, 0.8, 0.2]} castShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#60a5fa"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Center Magic Ring */}
        <mesh position={[0, 1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2, 2.2, 32]} />
          <meshBasicMaterial color="#fcd34d" transparent opacity={0.5} />
        </mesh>
      </Float>

      {/* Decorative Clouds underneath */}
      <Cloud position={[0, -8, 0]} opacity={0.5} speed={0.4} color="#cbd5e1" />
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
  const spriteColor = getElementColor(companion.element);
  const spriteUrl = getTexturePath(companion.element);

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        {/* Shadow under the sprite */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.7}
          scale={5}
          blur={2.5}
          far={4}
          color="#000000"
        />

        {/* Pedestal Pad for each Companion */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <cylinderGeometry args={[1.2, 1.4, 0.2, 16]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.5}
            metalness={0.8}
          />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.3, 1.5, 32]} />
          <meshBasicMaterial color={spriteColor} transparent opacity={0.8} />
        </mesh>

        <Billboard
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
          position={[0, 1.8, 0]}
        >
          {spriteUrl ? (
            <mesh scale={[3.5, 3.5, 1]}>
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
          count={40}
          scale={3}
          size={6}
          speed={0.6}
          opacity={0.8}
          position={[0, 1.5, 0]}
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

      <Sky sunPosition={[10, -2, -10]} turbidity={0.6} rayleigh={1.2} />
      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      <ambientLight intensity={0.5} color="#e2e8f0" />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        color="#fef08a"
      />

      {/* Rim light for cinematic feel */}
      <spotLight
        position={[-10, 5, -10]}
        intensity={2}
        color="#818cf8"
        penumbra={1}
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
