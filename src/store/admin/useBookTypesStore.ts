import { create } from "zustand";

interface StoreState {
  open: boolean;
  name: string;
  editingId: string;
  setName: (name: string) => void;
  setOpen: (value: boolean) => void;
  setEditingId: (value: string) => void;
}

export const useBookTypesStore = create<StoreState>((set) => ({
  open: false,
  name: "",
  editingId: "",
  setName: (value: string) =>
    set(() => ({
      name: value,
    })),
  setOpen: (value: boolean) =>
    set(() => ({
      open: value,
    })),
  setEditingId: (value: string) =>
    set(() => ({
      editingId: value,
    })),
}));
