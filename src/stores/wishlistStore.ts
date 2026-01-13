import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WishlistItem, Product } from '@/types';

interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product: Product) => {
        set((state) => {
          if (state.items.find((item) => item.productId === product.id)) {
            return state;
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                product,
                addedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },

      removeFromWishlist: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      toggleWishlist: (product: Product) => {
        const isInList = get().isInWishlist(product.id);
        if (isInList) {
          get().removeFromWishlist(product.id);
        } else {
          get().addToWishlist(product);
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.productId === productId);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'incubator-wishlist',
    }
  )
);
