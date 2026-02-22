import { create } from "zustand";
import type { ElementType } from "./useCompanionStore";
import { v4 as uuidv4 } from "uuid";

export type TurnStatus = "player_turn" | "enemy_turn" | "victory" | "defeat";

export interface Skill {
  name: string;
  damage: number;
  description: string;
}

export const getSkillForElement = (element: ElementType): Skill => {
  const skills: Record<ElementType, Skill> = {
    fire: {
      name: "Bola de Fogo",
      damage: 30,
      description: "Ataque explosivo.",
    },
    water: { name: "Jato d'Água", damage: 25, description: "Ataque veloz." },
    earth: {
      name: "Terremoto",
      damage: 35,
      description: "Ataque pesado e lento.",
    },
    plant: {
      name: "Chicote de Vinha",
      damage: 20,
      description: "Rouba vida (em breve).",
    },
    ice: {
      name: "Sopro Congelante",
      damage: 28,
      description: "Chance de lentidão.",
    },
    electric: {
      name: "Raio Choque",
      damage: 32,
      description: "Alta chance de crítico.",
    },
    lava: { name: "Erupção", damage: 45, description: "Dano massivo." },
    swamp: { name: "Bomba Lama", damage: 38, description: "Ataque venenoso." },
    magma: {
      name: "Esmagamento Vulcânico",
      damage: 50,
      description: "Dano brutal.",
    },
    nature: {
      name: "Ira da Floresta",
      damage: 40,
      description: "Ataque mágico.",
    },
    celestial: {
      name: "Julgamento Divino",
      damage: 80,
      description: "Ataque divino implacável.",
    },
    plasma: {
      name: "Raio Superaquecido",
      damage: 55,
      description: "Dano massivo elétrico.",
    },
    storm: {
      name: "Nevasca Trovejante",
      damage: 48,
      description: "Congela e Eletrocuta.",
    },
    ash: {
      name: "Cinza Vulcânica",
      damage: 42,
      description: "Queimadura contínua.",
    },
    spore: {
      name: "Esporos Elétricos",
      damage: 38,
      description: "Paralisa o oponente.",
    },
    frost: {
      name: "Tundra Gélida",
      damage: 45,
      description: "Ataque mágico congelante.",
    },
    cosmic: {
      name: "Colapso de Supernova",
      damage: 95,
      description: "Uma explosão estelar destrutiva.",
    },
    abyssal: {
      name: "Devorador de Almas",
      damage: 85,
      description: "Ataque do vazio.",
    },
    normal: { name: "Investida", damage: 15, description: "Ataque básico." },
  };
  return skills[element] || skills.normal;
};

export const calculateElementalMultiplier = (
  attacker: ElementType,
  defender: ElementType,
): number => {
  // Simplificando o "Rock, Paper, Scissors"
  const advantages: Record<string, ElementType[]> = {
    fire: ["plant", "ice", "nature"],
    water: ["fire", "lava", "magma"],
    earth: ["electric", "plasma", "storm"],
    plant: ["water", "earth", "swamp"],
    ice: ["plant", "water", "nature"],
    electric: ["water", "ice", "storm"],
    lava: ["plant", "earth", "nature"],
    swamp: ["fire", "electric", "plasma"],
    magma: ["ice", "plant", "nature"],
    nature: ["water", "earth", "swamp"],
    plasma: ["water", "ice", "nature"],
    storm: ["water", "fire", "lava"],
    ash: ["plant", "nature", "ice", "frost"],
    spore: ["water", "swamp"],
    frost: ["water", "nature", "earth"],
    celestial: ["abyssal", "cosmic"],
    cosmic: ["celestial", "abyssal"],
    abyssal: ["celestial", "cosmic"],
    normal: [],
  };

  const disadvantages: Record<string, ElementType[]> = {
    fire: ["water", "swamp"],
    water: ["plant", "electric", "nature"],
    earth: ["water", "ice", "plant"],
    plant: ["fire", "ice", "lava", "magma"],
    ice: ["fire", "lava", "magma"],
    electric: ["earth"],
    lava: ["water"],
    swamp: ["ice"],
    magma: ["water"],
    nature: ["fire", "ice", "lava", "magma"],
    plasma: ["earth", "swamp"],
    storm: ["earth", "swamp"],
    ash: ["water", "earth"],
    spore: ["fire", "magma", "lava"],
    frost: ["fire", "magma", "lava"],
    celestial: [],
    cosmic: [],
    abyssal: [],
    normal: [],
  };

  if (advantages[attacker]?.includes(defender)) return 1.5;
  if (disadvantages[attacker]?.includes(defender)) return 0.5;
  return 1.0; // Dano Neutro
};

export interface ActiveFighter {
  id: string;
  name: string;
  element: ElementType;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
}

interface BattleState {
  status: TurnStatus;
  animatingAttack: "player" | "enemy" | null;
  playerFighter: ActiveFighter | null;
  enemyFighter: ActiveFighter | null;
  nextEnemy: ActiveFighter | null; // Inimigo pendente para a próxima batalha
  battleLog: string[];
  generateNextEnemy: () => void;
  startBattle: (playerCompanion: ActiveFighter) => void;
  executePlayerTurn: () => void;
  executeEnemyTurn: () => void;
  flee: () => void;
  addLog: (msg: string) => void;
}

const generateRandomEnemy = (): ActiveFighter => {
  const elements: ElementType[] = [
    "fire",
    "water",
    "earth",
    "plant",
    "electric",
    "ice",
    "lava",
    "swamp",
    "magma",
    "nature",
    "plasma",
    "storm",
    "ash",
    "spore",
    "frost",
    "celestial",
    "cosmic",
    "abyssal",
  ];
  const randomElement = elements[Math.floor(Math.random() * elements.length)];
  const levelMult = Math.random() * 0.5 + 0.8; // 0.8 to 1.3
  const isGod = ["celestial", "cosmic", "abyssal"].includes(randomElement);
  const baseHp = isGod ? 200 : 100;
  const baseAtk = isGod ? 40 : 15;
  const baseDef = isGod ? 30 : 10;

  return {
    id: uuidv4(),
    name: `Wild ${randomElement}`,
    element: randomElement,
    hp: Math.floor(baseHp * levelMult),
    maxHp: Math.floor(baseHp * levelMult),
    atk: Math.floor(baseAtk * levelMult),
    def: Math.floor(baseDef * levelMult),
  };
};

export const useBattleStore = create<BattleState>((set, get) => ({
  status: "player_turn",
  animatingAttack: null,
  playerFighter: null,
  enemyFighter: null,
  nextEnemy: null,
  battleLog: [],

  addLog: (msg) => set((state) => ({ battleLog: [...state.battleLog, msg] })),

  generateNextEnemy: () => {
    set({ nextEnemy: generateRandomEnemy() });
  },

  startBattle: (playerCompanion) => {
    const state = get();
    const enemy = state.nextEnemy || generateRandomEnemy();
    set({
      status: "player_turn",
      playerFighter: { ...playerCompanion },
      enemyFighter: enemy,
      nextEnemy: null, // Consome o inimigo atual para depois gerar um novo quando fugir/vencer
      battleLog: [`Um ${enemy.name} selvagem apareceu!`, "Sua vez!"],
    });
  },

  executePlayerTurn: () => {
    const state = get();
    if (
      state.status !== "player_turn" ||
      !state.playerFighter ||
      !state.enemyFighter
    )
      return;

    // Começa a animação de ataque
    set({ animatingAttack: "player" });

    setTimeout(() => {
      const state = get();
      if (!state.playerFighter || !state.enemyFighter) return;

      const skill = getSkillForElement(state.playerFighter.element);
      const rawDamage = skill.damage + state.playerFighter.atk;
      const multiplier = calculateElementalMultiplier(
        state.playerFighter.element,
        state.enemyFighter.element,
      );
      const actualDamage = Math.max(
        1,
        Math.floor(
          (rawDamage - Math.floor(state.enemyFighter.def / 2)) * multiplier,
        ),
      );
      const newEnemyHp = Math.max(0, state.enemyFighter.hp - actualDamage);

      let effText = "";
      if (multiplier > 1) effText = " É Super Efetivo! (x1.5)";
      if (multiplier < 1) effText = " Não é muito efetivo... (x0.5)";

      get().addLog(
        `${state.playerFighter.name} usou ${skill.name}!${effText} Causou ${actualDamage} de dano.`,
      );

      if (newEnemyHp <= 0) {
        set((s) => ({
          enemyFighter: s.enemyFighter ? { ...s.enemyFighter, hp: 0 } : null,
          status: "victory",
          animatingAttack: null,
        }));
        get().addLog(`O inimigo foi derrotado! Você venceu a batalha.`);
      } else {
        set((s) => ({
          enemyFighter: s.enemyFighter
            ? { ...s.enemyFighter, hp: newEnemyHp }
            : null,
          status: "enemy_turn",
          animatingAttack: null,
        }));
        get().addLog(`Turno do inimigo.`);
        setTimeout(() => get().executeEnemyTurn(), 1500);
      }
    }, 600); // tempo para o "dash" bater visualmente no Threejs
  },

  executeEnemyTurn: () => {
    const state = get();
    if (
      state.status !== "enemy_turn" ||
      !state.playerFighter ||
      !state.enemyFighter
    )
      return;

    set({ animatingAttack: "enemy" });

    setTimeout(() => {
      const state = get();
      if (!state.playerFighter || !state.enemyFighter) return;

      const skill = getSkillForElement(state.enemyFighter.element);
      const rawDamage = skill.damage + state.enemyFighter.atk;
      const multiplier = calculateElementalMultiplier(
        state.enemyFighter.element,
        state.playerFighter.element,
      );
      const actualDamage = Math.max(
        1,
        Math.floor(
          (rawDamage - Math.floor(state.playerFighter.def / 2)) * multiplier,
        ),
      );
      const newPlayerHp = Math.max(0, state.playerFighter.hp - actualDamage);

      let effText = "";
      if (multiplier > 1) effText = " É Super Efetivo! (x1.5)";
      if (multiplier < 1) effText = " Não é muito efetivo... (x0.5)";

      get().addLog(
        `${state.enemyFighter.name} atacou com ${skill.name}!${effText} Causou ${actualDamage} de dano.`,
      );

      if (newPlayerHp <= 0) {
        set((s) => ({
          playerFighter: s.playerFighter ? { ...s.playerFighter, hp: 0 } : null,
          status: "defeat",
          animatingAttack: null,
        }));
        get().addLog(`Seu companion desmaiou... Você perdeu a batalha.`);
      } else {
        set((s) => ({
          playerFighter: s.playerFighter
            ? { ...s.playerFighter, hp: newPlayerHp }
            : null,
          status: "player_turn",
          animatingAttack: null,
        }));
        get().addLog(`Sua vez!`);
      }
    }, 600);
  },

  flee: () => {
    get().generateNextEnemy(); // Gera o novo monstrinho
    set({
      status: "player_turn",
      animatingAttack: null,
      playerFighter: null,
      enemyFighter: null,
      battleLog: [],
    });
  },
}));
