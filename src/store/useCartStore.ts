// import { create } from "zustand";

// // Define product type
// export interface Product {
//   id: string;
//   name: string;
//   productType: {
//     id: number;
//     name: string;
//   };
//   productCategory: {
//     id: number;
//     name: string;
//   };
//   author: {
//     id: number;
//     fullName: string;
//     definition: string;
//   };
//   photo: {
//     id: string;
//     prefix: string;
//     name: string;
//   };
//   price: number;
//   salePrice: number;
//   quantity: number;
//   description: string;
//   about: string;
// }

// // Define the cart store state & actions
// interface CartState {
//   cart: Product[];
//   totalPrice: number;
//   addToCart: (product: Product, quantity: number) => void;
//   increase: (id: string) => void;
//   decrease: (id: string) => void;
//   removeItem: (id: string) => void;
//   calculateTotal: () => void;
//   clearCart: () => void;
// }

// const getPrice = (product: Product) => {
//   return product.salePrice; // ✅ Uses only the existing price property
// };

// // Create Zustand store
// export const useCartStore = create<CartState>((set, get) => ({
//   cart: [],
//   totalPrice: 0,

//   addToCart: (product, quantity) => {
//     set((state) => {
//       const existingItem = state.cart.find((item) => item.id === product.id);
//       let updatedCart;

//       if (existingItem) {
//         updatedCart = state.cart.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       } else {
//         updatedCart = [...state.cart, { ...product, quantity }];
//       }

//       return { cart: updatedCart };
//     });

//     get().calculateTotal();
//   },

//   increase: (id) => {
//     set((state) => {
//       const updatedCart = state.cart.map((item) =>
//         item.id === id
//           ? { ...item, quantity: (item.quantity ?? 0) + 1 } // ✅ Ensures quantity is defined
//           : item
//       );
//       return { cart: updatedCart };
//     });

//     get().calculateTotal();
//   },

//   decrease: (id) => {
//     set((state) => ({
//       cart: state.cart
//         .map((item) =>
//           item.id === id
//             ? { ...item, quantity: Math.max((item.quantity ?? 1) - 1, 0) } // ✅ Prevents negative quantity
//             : item
//         )
//         .filter((item) => item.quantity > 0), // ✅ Removes item if quantity is 0
//     }));

//     get().calculateTotal();
//   },

//   removeItem: (id) => {
//     set((state) => ({
//       cart: state.cart.filter((item) => item.id !== id),
//     }));

//     get().calculateTotal();
//   },

//   calculateTotal: () => {
//     set((state) => ({
//       totalPrice: state.cart.reduce(
//         (total, item) => total + getPrice(item) * item.quantity,
//         0
//       ),
//     }));
//   },

//   clearCart: () => {
//     set({ cart: [], totalPrice: 0 }); // ✅ Resets cart and total price
//   },
// }));

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define product type
export interface Product {
  id: string;
  name: string;
  productType: {
    id: number;
    name: string;
  };
  productCategory: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    fullName: string;
    definition: string;
  };
  photo: {
    id: string;
    prefix: string;
    name: string;
  };
  price: number;
  salePrice: number;
  quantity: number;
  description: string;
  about: string;
}

// Define the cart store state & actions
interface CartState {
  cart: Product[];
  totalPrice: number;
  addToCart: (product: Product, quantity: number) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  calculateTotal: () => void;
  clearCart: () => void;
}

const getPrice = (product: Product) => {
  return product.salePrice; // ✅ Uses only the existing price property
};

// Create Zustand store with localStorage persistence
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      totalPrice: 0,

      addToCart: (product, quantity) => {
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.id === product.id
          );
          let updatedCart;

          if (existingItem) {
            updatedCart = state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            updatedCart = [...state.cart, { ...product, quantity }];
          }

          return { cart: updatedCart };
        });

        get().calculateTotal();
      },

      increase: (id) => {
        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item.id === id
              ? { ...item, quantity: (item.quantity ?? 0) + 1 }
              : item
          );
          return { cart: updatedCart };
        });

        get().calculateTotal();
      },

      decrease: (id) => {
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.id === id
                ? { ...item, quantity: Math.max((item.quantity ?? 1) - 1, 0) }
                : item
            )
            .filter((item) => item.quantity > 0),
        }));

        get().calculateTotal();
      },

      removeItem: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));

        get().calculateTotal();
      },

      calculateTotal: () => {
        set((state) => ({
          totalPrice: state.cart.reduce(
            (total, item) => total + getPrice(item) * item.quantity,
            0
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [], totalPrice: 0 });
      },
    }),
    {
      name: "cart-storage", // key in localStorage
      partialize: (state) => ({
        cart: state.cart,
        totalPrice: state.totalPrice,
      }),
    }
  )
);
