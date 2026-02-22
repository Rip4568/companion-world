import { create } from "zustand";

export type ScreenName =
  | "menu"
  | "encyclopedia"
  | "breeding"
  | "world"
  | "inventory";

export interface GameState {
  currentScreen: ScreenName;
  setScreen: (screen: ScreenName) => void;
  gold: number;
  foodCount: number;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  addFood: (amount: number) => void;
  useFood: (amount: number) => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentScreen: "menu",
  setScreen: (screen) => set({ currentScreen: screen }),
  gold: 500,
  foodCount: 10,

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

  useFood: (amount) => {
    const { foodCount } = get();
    if (foodCount >= amount) {
      set({ foodCount: foodCount - amount });
      return true;
    }
    return false;
  },
}));
