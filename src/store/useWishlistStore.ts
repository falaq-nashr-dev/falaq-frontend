import { create } from "zustand";
import { AdminBooks } from "@/types";

interface WishlistState {
  wishlist: AdminBooks[];
  addToWishlist: (book: AdminBooks) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (book: AdminBooks) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: JSON.parse(localStorage.getItem("wishlist") || "[]"),

  addToWishlist: (book) =>
    set((state) => {
      const updated = [...state.wishlist, book];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return { wishlist: updated };
    }),

  removeFromWishlist: (id) =>
    set((state) => {
      const updated = state.wishlist.filter((item) => item.id !== id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return { wishlist: updated };
    }),

  toggleWishlist: (book) => {
    const { wishlist } = get();
    const exists = wishlist.some((item) => item.id === book.id);
    if (exists) {
      get().removeFromWishlist(book.id);
    } else {
      get().addToWishlist(book);
    }
  },

  isInWishlist: (id) => get().wishlist.some((item) => item.id === id),
}));
