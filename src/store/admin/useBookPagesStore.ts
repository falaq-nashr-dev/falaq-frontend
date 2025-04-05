import { create } from "zustand";

interface StoreState {
  open: boolean;
  pageNumber: string;
  content: string;
  editingId: string;
  setContent: (content: string) => void;
  setPageNumber: (pageNumber: string) => void;
  setOpen: (value: boolean) => void;
  setEditingId: (value: string) => void;
}

export const useBookPagesStore = create<StoreState>((set) => ({
  open: false,
  content: "",
  pageNumber: "",
  editingId: "",
  setContent: (value: string) =>
    set(() => ({
      content: value,
    })),
  setPageNumber: (value: string) =>
    set(() => ({
      pageNumber: value,
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
