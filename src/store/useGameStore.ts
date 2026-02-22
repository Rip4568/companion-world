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
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  addFood: (amount: number) => void;
  consumeFood: (amount: number) => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentScreen: "landing",
  setScreen: (screen) => set({ currentScreen: screen }),
  gold: 2000,
  foodCount: 20,

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
}));
