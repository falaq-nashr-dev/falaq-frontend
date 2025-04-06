import { create } from "zustand";

interface StoreState {
  editingId: string;
  setEditingId: (value: string) => void;
}

export const useBookStore = create<StoreState>((set) => ({
  editingId: "",
  setEditingId: (value: string) =>
    set(() => ({
      editingId: value,
    })),
}));
