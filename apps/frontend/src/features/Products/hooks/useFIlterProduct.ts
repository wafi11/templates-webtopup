import { create } from "zustand";
type FilterProduct = {
  category: number | null;
  setCategory: (cat: number | null) => void;
};

export const useFilterProduct = create<FilterProduct>((set) => ({
  category: null,
  setCategory: (cat) => set({ category: cat }),
}));
