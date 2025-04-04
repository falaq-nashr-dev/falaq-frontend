import { create } from "zustand";

interface StoreState {
  selectedCategory: string | null;

  phoneNumber: string;
  shopName: string;
  searchValue: string;
  currentPage: number;
  setSelectedPhone: (phone: string) => void;
  setSelectedShopName: (phone: string) => void;
  setSearchValue: (value: string) => void;
  setCurrentPage: (page: number) => void;
  setSelectedCategory: (categoryId: string | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  phoneNumber: "",
  shopName: "",
  searchValue: "",
  currentPage: 1,
  selectedCategory: null,
  setSelectedCategory: (value: string | null) =>
    set(() => ({
      selectedCategory: value,
    })),
  setSelectedPhone: (value: string) =>
    set(() => ({
      phoneNumber: value,
    })),
  setSelectedShopName: (value: string) =>
    set(() => ({
      shopName: value,
    })),
  setSearchValue: (value: string) =>
    set(() => ({
      searchValue: value,
    })),
  setCurrentPage: (page: number) =>
    set(() => ({
      currentPage: page,
    })),
}));
