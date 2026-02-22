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
    normal: { name: "Investida", damage: 15, description: "Ataque básico." },
  };
  return skills[element] || skills.normal;
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
  playerFighter: ActiveFighter | null;
  enemyFighter: ActiveFighter | null;
  battleLog: string[];
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
  ];
  const randomElement = elements[Math.floor(Math.random() * elements.length)];
  const levelMult = Math.random() * 0.5 + 0.8; // 0.8 to 1.3
  return {
    id: uuidv4(),
    name: `Wild ${randomElement}`,
    element: randomElement,
    hp: Math.floor(100 * levelMult),
    maxHp: Math.floor(100 * levelMult),
    atk: Math.floor(15 * levelMult),
    def: Math.floor(10 * levelMult),
  };
};

export const useBattleStore = create<BattleState>((set, get) => ({
  status: "player_turn",
  playerFighter: null,
  enemyFighter: null,
  battleLog: [],

  addLog: (msg) => set((state) => ({ battleLog: [...state.battleLog, msg] })),

  startBattle: (playerCompanion) => {
    const enemy = generateRandomEnemy();
    set({
      status: "player_turn",
      playerFighter: { ...playerCompanion },
      enemyFighter: enemy,
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

    const skill = getSkillForElement(state.playerFighter.element);

    // Calcula dano simples considerando defesa inimiga
    const rawDamage = skill.damage + state.playerFighter.atk;
    const actualDamage = Math.max(
      1,
      rawDamage - Math.floor(state.enemyFighter.def / 2),
    );

    const newEnemyHp = Math.max(0, state.enemyFighter.hp - actualDamage);

    get().addLog(
      `${state.playerFighter.name} usou ${skill.name}! Causou ${actualDamage} de dano.`,
    );

    if (newEnemyHp <= 0) {
      set((s) => ({
        enemyFighter: s.enemyFighter ? { ...s.enemyFighter, hp: 0 } : null,
        status: "victory",
      }));
      get().addLog(`O inimigo foi derrotado! Você venceu a batalha.`);
    } else {
      set((s) => ({
        enemyFighter: s.enemyFighter
          ? { ...s.enemyFighter, hp: newEnemyHp }
          : null,
        status: "enemy_turn",
      }));
      get().addLog(`Turno do inimigo.`);
      setTimeout(() => get().executeEnemyTurn(), 1500);
    }
  },

  executeEnemyTurn: () => {
    const state = get();
    if (
      state.status !== "enemy_turn" ||
      !state.playerFighter ||
      !state.enemyFighter
    )
      return;

    const skill = getSkillForElement(state.enemyFighter.element);

    const rawDamage = skill.damage + state.enemyFighter.atk;
    const actualDamage = Math.max(
      1,
      rawDamage - Math.floor(state.playerFighter.def / 2),
    );

    const newPlayerHp = Math.max(0, state.playerFighter.hp - actualDamage);

    get().addLog(
      `${state.enemyFighter.name} atacou com ${skill.name}! Causou ${actualDamage} de dano.`,
    );

    if (newPlayerHp <= 0) {
      set((s) => ({
        playerFighter: s.playerFighter ? { ...s.playerFighter, hp: 0 } : null,
        status: "defeat",
      }));
      get().addLog(`Seu companion desmaiou... Você perdeu a batalha.`);
    } else {
      set((s) => ({
        playerFighter: s.playerFighter
          ? { ...s.playerFighter, hp: newPlayerHp }
          : null,
        status: "player_turn",
      }));
      get().addLog(`Sua vez!`);
    }
  },

  flee: () => {
    set({
      status: "player_turn",
      playerFighter: null,
      enemyFighter: null,
      battleLog: [],
    });
  },
}));
