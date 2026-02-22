import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import {
  determineOffspringElement,
  calculateOffspringStats,
} from "../utils/gameLogic/breeding";

export type ElementType =
  | "fire"
  | "water"
  | "earth"
  | "plant"
  | "ice"
  | "electric"
  | "lava"
  | "swamp"
  | "magma"
  | "nature"
  | "plasma"
  | "storm"
  | "ash"
  | "spore"
  | "frost"
  | "celestial"
  | "cosmic"
  | "abyssal"
  | "normal";

export interface Companion {
  id: string;
  name: string;
  element: ElementType;
  maxHp: number;
  hp: number;
  atk: number;
  def: number;
  hunger: number; // 0 to 100
  activity: "idle" | "working";
}

interface CompanionState {
  companions: Companion[];
  addCompanion: (companion: Omit<Companion, "id">) => void;
  feed: (id: string, amount: number) => void;
  breed: (parent1Id: string, parent2Id: string) => Companion | null;
  hatchEgg: (type: "basic" | "premium") => Companion;
  setCompanionActivity: (id: string, activity: "idle" | "working") => void;
}

const INITIAL_COMPANIONS: Companion[] = [
  {
    id: uuidv4(),
    name: "Ignis",
    element: "fire",
    maxHp: 100,
    hp: 100,
    atk: 25,
    def: 15,
    hunger: 80,
    activity: "idle",
  },
  {
    id: uuidv4(),
    name: "Glacie",
    element: "ice",
    maxHp: 120,
    hp: 120,
    atk: 18,
    def: 20,
    hunger: 100,
    activity: "idle",
  },
];

export const useCompanionStore = create<CompanionState>((set, get) => ({
  companions: INITIAL_COMPANIONS,

  addCompanion: (companionData) =>
    set((state) => ({
      companions: [
        ...state.companions,
        { ...companionData, id: uuidv4(), activity: "idle" },
      ],
    })),

  feed: (id, amount) =>
    set((state) => ({
      companions: state.companions.map((c) =>
        c.id === id ? { ...c, hunger: Math.min(100, c.hunger + amount) } : c,
      ),
    })),

  breed: (parent1Id, parent2Id) => {
    const { companions } = get();
    const parent1 = companions.find((c) => c.id === parent1Id);
    const parent2 = companions.find((c) => c.id === parent2Id);

    if (!parent1 || !parent2) return null;
    if (parent1Id === parent2Id) return null; // Cannot breed with self

    const newElement = determineOffspringElement(
      parent1.element,
      parent2.element,
    );
    const newStats = calculateOffspringStats(parent1, parent2);

    const createdWithId: Companion = {
      id: uuidv4(),
      name: `Baby ${newElement}`,
      element: newElement,
      maxHp: newStats.maxHp,
      hp: newStats.maxHp,
      atk: newStats.atk,
      def: newStats.def,
      hunger: 100,
      activity: "idle",
    };

    set((state) => ({
      companions: [...state.companions, createdWithId],
    }));

    return createdWithId;
  },

  hatchEgg: (type) => {
    const rawRng = Math.random();
    let rarity: "common" | "mixed" | "god" = "common";

    if (type === "basic") {
      // 80% Common, 18% Mixed, 2% GOD
      if (rawRng > 0.98) rarity = "god";
      else if (rawRng > 0.8) rarity = "mixed";
    } else {
      // 50% Common, 35% Mixed, 15% GOD
      if (rawRng > 0.85) rarity = "god";
      else if (rawRng > 0.5) rarity = "mixed";
    }

    const commonElems: ElementType[] = [
      "fire",
      "water",
      "earth",
      "plant",
      "ice",
      "electric",
      "normal",
    ];
    const mixedElems: ElementType[] = ["lava", "swamp", "magma", "nature"];
    const godElems: ElementType[] = ["celestial", "cosmic", "abyssal"];

    let chosenElement: ElementType = "normal";
    let baseHp = 100,
      baseAtk = 20,
      baseDef = 15;

    if (rarity === "god") {
      chosenElement = godElems[Math.floor(Math.random() * godElems.length)];
      baseHp = Math.floor(200 + Math.random() * 100);
      baseAtk = Math.floor(50 + Math.random() * 30);
      baseDef = Math.floor(40 + Math.random() * 20);
    } else if (rarity === "mixed") {
      chosenElement = mixedElems[Math.floor(Math.random() * mixedElems.length)];
      baseHp = Math.floor(120 + Math.random() * 30);
      baseAtk = Math.floor(25 + Math.random() * 15);
      baseDef = Math.floor(20 + Math.random() * 15);
    } else {
      chosenElement =
        commonElems[Math.floor(Math.random() * commonElems.length)];
      baseHp = Math.floor(90 + Math.random() * 20);
      baseAtk = Math.floor(15 + Math.random() * 10);
      baseDef = Math.floor(10 + Math.random() * 10);
    }

    const prefixes = ["Baby", "Wild", "Little", "Epic", "Shiny"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

    const createdWithId: Companion = {
      id: uuidv4(),
      name:
        rarity === "god"
          ? `Lord ${chosenElement}`
          : `${prefix} ${chosenElement}`,
      element: chosenElement,
      maxHp: baseHp,
      hp: baseHp,
      atk: baseAtk,
      def: baseDef,
      hunger: 50, // Nasce com fome
      activity: "idle",
    };
    set((state) => ({ companions: [...state.companions, createdWithId] }));
    return createdWithId;
  },

  setCompanionActivity: (id, activity) =>
    set((state) => ({
      companions: state.companions.map((c) =>
        c.id === id ? { ...c, activity } : c,
      ),
    })),
}));
