import { create } from "zustand";

export type ScreenName =
  | "encyclopedia"
  | "breeding"
  | "world"
  | "inventory"
  | "shop"
  | "battle"
  | "landing";

export interface GameState {
  currentScreen: ScreenName;
  setScreen: (screen: ScreenName) => void;
  gold: number;
  foodCount: number;
  potions: number;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  addFood: (amount: number) => void;
  consumeFood: (amount: number) => boolean;
  addPotion: (amount: number) => void;
  consumePotion: (amount: number) => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentScreen: "landing",
  setScreen: (screen) => set({ currentScreen: screen }),
  gold: 2000,
  foodCount: 20,
  potions: 5,

  addGold: (amount) => set((state) => ({ gold: state.gold + amount })),

  spendGold: (amount) => {
    const { gold } = get();
    if (gold >= amount) {
      set({ gold: gold - amount });
      return true;
    }
    return false;
  },

  addFood: (amount) =>
    set((state) => ({ foodCount: state.foodCount + amount })),

  consumeFood: (amount) => {
    const { foodCount } = get();
    if (foodCount >= amount) {
      set({ foodCount: foodCount - amount });
      return true;
    }
    return false;
  },

  addPotion: (amount) => set((state) => ({ potions: state.potions + amount })),

  consumePotion: (amount) => {
    const { potions } = get();
    if (potions >= amount) {
      set({ potions: potions - amount });
      return true;
    }
    return false;
  },
}));
