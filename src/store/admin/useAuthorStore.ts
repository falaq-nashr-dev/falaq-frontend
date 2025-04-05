import { create } from "zustand";

interface StoreState {
  open: boolean;
  name: string;
  definition: string;
  editingId: string;
  setName: (name: string) => void;
  setDefinition: (name: string) => void;
  setOpen: (value: boolean) => void;
  setEditingId: (value: string) => void;
}

export const useAuthorStore = create<StoreState>((set) => ({
  open: false,
  name: "",
  definition: "",
  editingId: "",
  setName: (value: string) =>
    set(() => ({
      name: value,
    })),
  setDefinition: (value: string) =>
    set(() => ({
      definition: value,
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
