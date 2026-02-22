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
}

interface CompanionState {
  companions: Companion[];
  addCompanion: (companion: Omit<Companion, "id">) => void;
  feed: (id: string, amount: number) => void;
  breed: (parent1Id: string, parent2Id: string) => Companion | null;
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
  },
];

export const useCompanionStore = create<CompanionState>((set, get) => ({
  companions: INITIAL_COMPANIONS,

  addCompanion: (companionData) =>
    set((state) => ({
      companions: [...state.companions, { ...companionData, id: uuidv4() }],
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
    };

    set((state) => ({
      companions: [...state.companions, createdWithId],
    }));

    return createdWithId;
  },
}));
